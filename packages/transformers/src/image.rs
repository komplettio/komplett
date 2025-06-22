use crate::js;
use crate::transformers;
use crate::transformers::image_transformer;

use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "makeImage")]
pub fn make_image(data: Vec<u8>) -> Image {
    js::log("Rust: Creating image from data");
    let img = Image {
        optimized: false,
        data,
    };
    js::log(&format!(
        "Image created with {} bytes of data",
        img.data.len()
    ));

    img
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Image {
    pub optimized: bool,
    data: Vec<u8>,
}

#[wasm_bindgen]
impl Image {
    #[wasm_bindgen(js_name = getData)]
    pub fn get_data(&self) -> Vec<u8> {
        self.data.clone()
    }

    #[wasm_bindgen(js_name = setData)]
    pub fn set_data(&mut self, data: Vec<u8>) {
        self.data = data;
    }
}

#[wasm_bindgen]
pub struct ImageProcessor {
    kind: image_transformer::TImageTransformer,
    image: Image,
    transformer: transformers::Transformer<image_transformer::TImageTransformer, Image>,
}

#[wasm_bindgen]
impl ImageProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new(image: Image) -> ImageProcessor {
        let kind = image_transformer::TImageTransformer;
        let transformer: transformers::Transformer<image_transformer::TImageTransformer, Image> =
            transformers::Transformer::new(kind);

        ImageProcessor {
            kind,
            transformer,
            image,
        }
    }

    pub fn optimize(&mut self, level: u8, interlace: bool, optimize_alpha: bool) {
        self.transformer.optimize(level, interlace, optimize_alpha);
    }

    pub fn execute(&mut self) -> Vec<u8> {
        js::log("Rust: Starting processing");
        let img = self.transformer.exec(self.image.clone());

        if img.optimized {
            js::log("Rust: Image has been optimized");
        } else {
            js::log("Rust: Image has not been optimized");
        }

        img.get_data()
    }
}
