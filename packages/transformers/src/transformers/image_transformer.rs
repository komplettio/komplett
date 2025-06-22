use ::image::{DynamicImage, ImageFormat, ImageReader};
use core::panic;
use oxipng::Interlacing;
use std::io::Cursor;
use wasm_bindgen::prelude::*;

use crate::js;
use crate::transformers;

#[wasm_bindgen]
#[derive(Default, Debug, Copy, Clone)]
pub struct TImageTransformer;

impl transformers::Transformer<TImageTransformer, DynamicImage> {
    /// Import an image array buffer into the transformer.
    /// The transformer will guess the image format based on the data, using the `image` crate.
    pub fn import(&mut self, raw: Vec<u8>) {
        let reader = ImageReader::new(Cursor::new(raw))
            .with_guessed_format()
            .expect("Cursor io never fails");

        let format = reader
            .format()
            .expect("Failed to get image format while importing.");
        let supported_format = ImageFormat::all().any(|f| f == format);

        if !supported_format {
            panic!("Unsupported image format: {:?}", format);
        }

        let image = reader.decode().expect("Failed to decode image data");

        self.data = Some(image);
    }

    pub fn optimize(&mut self, level: u8, interlace: bool, optimize_alpha: bool) {
        self.chain(move |mut img| {
            let mut options = oxipng::Options::from_preset(level);

            options.interlace = Some(if interlace {
                Interlacing::Adam7
            } else {
                Interlacing::None
            });
            options.optimize_alpha = optimize_alpha;

            // get a png buffer
            let mut buffer = Cursor::new(Vec::new());
            img.write_to(&mut buffer, ImageFormat::Png)
                .expect("Failed to write image");
            let png = buffer.into_inner();

            let png_res = oxipng::optimize_from_memory(&png, &options).unwrap_throw();

            let reader = ImageReader::new(Cursor::new(png_res))
                .with_guessed_format()
                .expect("Cursor io never fails");

            let res = reader
                .decode()
                .expect("Failed to decode optimized image data");

            res
        })
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        self.chain(move |mut img| {
            js::log(&format!("Resizing image to {}x{}...", width, height));
            img
        })
    }
}
