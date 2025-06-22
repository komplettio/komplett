use crate::image;
use crate::js;
use crate::transformers;

use oxipng::Interlacing;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Default, Debug, Copy, Clone)]
pub struct TImageTransformer;

impl transformers::Transformer<TImageTransformer, image::Image> {
    pub fn optimize(&mut self, level: u8, interlace: bool, optimize_alpha: bool) {
        self.chain(move |mut img| {
            let mut options = oxipng::Options::from_preset(level);

            options.interlace = Some(if interlace {
                Interlacing::Adam7
            } else {
                Interlacing::None
            });
            options.optimize_alpha = optimize_alpha;

            let res = oxipng::optimize_from_memory(&img.get_data(), &options).unwrap_throw();

            img.set_data(res);
            img.optimized = true;

            img
        })
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        self.chain(move |mut img| {
            js::log(&format!("Resizing image to {}x{}...", width, height));
            img
        })
    }
}
