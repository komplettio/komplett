use image::DynamicImage;
use image::ImageFormat;
use std::io::Cursor;
use wasm_bindgen::prelude::*;

use crate::js;
use crate::transformers;
use crate::transformers::image_transformer;

#[wasm_bindgen]
pub struct ImageProcessor {
    kind: image_transformer::TImageTransformer,
    transformer: transformers::Transformer<image_transformer::TImageTransformer, DynamicImage>,
}

#[wasm_bindgen]
impl ImageProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> ImageProcessor {
        let kind = image_transformer::TImageTransformer;
        let transformer: transformers::Transformer<
            image_transformer::TImageTransformer,
            DynamicImage,
        > = transformers::Transformer::new(kind);

        ImageProcessor { kind, transformer }
    }

    pub fn import(&mut self, raw: Vec<u8>) {
        js::log("Rust: Importing image data");
        self.transformer.import(raw);
    }

    pub fn optimize(&mut self, level: u8, interlace: bool, optimize_alpha: bool) {
        self.transformer.optimize(level, interlace, optimize_alpha);
    }

    #[wasm_bindgen(js_name = "processTo")]
    pub fn process_to(&mut self, format: &str) -> Vec<u8> {
        let format = match format.to_lowercase().as_str() {
            "png" => ImageFormat::Png,
            "jpeg" | "jpg" => ImageFormat::Jpeg,
            "gif" => ImageFormat::Gif,
            "bmp" => ImageFormat::Bmp,
            "webp" => ImageFormat::WebP,
            _ => panic!("Unsupported image format: {}", format),
        };

        js::log("Rust: Starting processing");
        let img = self.transformer.exec();

        let mut buffer = Cursor::new(Vec::new());
        img.write_to(&mut buffer, format)
            .expect("Failed to write image");
        buffer.into_inner()
    }
}
