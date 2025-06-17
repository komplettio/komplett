mod png;
mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn optimise_png(data: &[u8], level: u8, interlace: bool, optimize_alpha: bool) -> Vec<u8> {
    return png::optimise(data, level, interlace, optimize_alpha);
}
