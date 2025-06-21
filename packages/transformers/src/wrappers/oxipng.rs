use crate::utils;
use oxipng::Interlacing;
use std::panic;
use wasm_bindgen::prelude::*;

extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

pub fn optimise(data: &[u8], level: u8, interlace: bool, optimize_alpha: bool) -> Vec<u8> {
    utils::set_panic_hook();

    let mut options = oxipng::Options::from_preset(level);
    options.interlace = Some(if interlace {
        Interlacing::Adam7
    } else {
        Interlacing::None
    });
    options.optimize_alpha = optimize_alpha;

    oxipng::optimize_from_memory(data, &options).unwrap_throw()
}
