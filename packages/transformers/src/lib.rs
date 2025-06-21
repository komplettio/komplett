mod transformers;
mod utils;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

#[wasm_bindgen]
#[derive(Default, Debug, Copy, Clone)]
pub struct TImageTransformer;

pub trait TransformerKind: std::fmt::Debug {
    fn kind_name(&self) -> &'static str;
}

impl TransformerKind for TImageTransformer {
    fn kind_name(&self) -> &'static str {
        "image"
    }
}

#[wasm_bindgen]
pub struct KomplettTransformerImage {
    pub kind: TImageTransformer,
    pub image: transformers::image::Image,
    transformer: transformers::Transformer<TImageTransformer, transformers::image::Image>,
}

#[wasm_bindgen]
impl KomplettTransformerImage {
    #[wasm_bindgen(constructor)]
    pub fn new(image: transformers::image::Image) -> KomplettTransformerImage {
        let kind = TImageTransformer;
        let transformer: transformers::Transformer<TImageTransformer, transformers::image::Image> =
            transformers::Transformer::new(kind.clone());

        KomplettTransformerImage {
            kind,
            transformer,
            image,
        }
    }

    pub fn optimize(self, opts: transformers::image::ImageOptimizeOpts) {
        utils::set_panic_hook();
        log("Rust: Starting optimization");
        self.transformer.optimize(opts);
        log("Rust: Optimization complete");
        if self.image.optimized {
            log("Image has been optimized successfully.");
        } else {
            log("Image optimization failed.");
        }
    }

    pub fn execute(self) -> transformers::image::Image {
        self.transformer.exec(self.image)
    }
}
