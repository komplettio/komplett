use crate::transformers::Transformer;
use crate::TImageTransformer;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Default, Debug, Copy, Clone)]
pub struct Image {
    pub width: u32,
    pub height: u32,
    pub optimized: bool,
}

#[wasm_bindgen]
impl Image {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32, optimized: bool) -> Self {
        Self {
            width,
            height,
            optimized,
        }
    }
}

// Skipping typescript generation to force type to be interface, not class
#[wasm_bindgen]
pub struct ImageOptimizeOpts {
    level: u8,
    interlace: bool,
    optimize_alpha: bool,
}

#[wasm_bindgen]
impl ImageOptimizeOpts {
    #[wasm_bindgen(constructor)]
    pub fn new(level: u8, interlace: bool, optimize_alpha: bool) -> Self {
        Self {
            level,
            interlace,
            optimize_alpha,
        }
    }
}

impl Transformer<TImageTransformer, Image> {
    pub fn optimize(self, opts: ImageOptimizeOpts) -> Self {
        self.chain(|mut img| {
            println!("Optimizing image...");
            img.optimized = true;
            img
        })
    }

    pub fn resize(self, width: u32, height: u32) -> Self {
        self.chain(move |mut img| {
            println!("Resizing image to {}x{}...", width, height);
            img.width = width;
            img.height = height;
            img
        })
    }
}
