mod image;
mod js;
mod transformers;

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn init() {
    // This function is called to initialize the module.
    // It can be used to set up any global state or configurations.
    console_error_panic_hook::set_once();
    js::log("Komplett initialized");
}
