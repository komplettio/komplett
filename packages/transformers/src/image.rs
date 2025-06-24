use image::DynamicImage;
use image::ImageFormat;
use wasm_bindgen::prelude::*;

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

    fn get_format(format: &str) -> ImageFormat {
        match format.to_lowercase().as_str() {
            "png" => ImageFormat::Png,
            "jpeg" | "jpg" => ImageFormat::Jpeg,
            "gif" => ImageFormat::Gif,
            "bmp" => ImageFormat::Bmp,
            "webp" => ImageFormat::WebP,
            _ => panic!("Unsupported image format: {}", format),
        }
    }

    pub fn import(&mut self, raw: Vec<u8>) {
        self.transformer.import(raw);
    }

    pub fn export(&mut self, format: &str) -> Vec<u8> {
        let format = Self::get_format(format);

        self.transformer.export(format)
    }

    pub fn rotate(&mut self, degrees: u16) {
        let rotation = match degrees {
            90 => image_transformer::ImageRotation::Degrees90,
            180 => image_transformer::ImageRotation::Degrees180,
            270 => image_transformer::ImageRotation::Degrees270,
            _ => panic!("Unsupported rotation angle: {}", degrees),
        };

        self.transformer.rotate(rotation);
    }

    pub fn resize(&mut self, width: u32, height: u32, maintain_aspect_ratio: bool, filter: &str) {
        let filter = match filter.to_lowercase().as_str() {
            "nearest" => image::imageops::FilterType::Nearest,
            "triangle" => image::imageops::FilterType::Triangle,
            "catmullrom" => image::imageops::FilterType::CatmullRom,
            "gaussian" => image::imageops::FilterType::Gaussian,
            "lanczos3" => image::imageops::FilterType::Lanczos3,
            _ => panic!("Unsupported filter type: {}", filter),
        };

        self.transformer
            .resize(width, height, maintain_aspect_ratio, filter);
    }

    pub fn crop(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.transformer.crop(x, y, width, height);
    }

    pub fn flip(&mut self, horizontal: bool, vertical: bool) {
        if horizontal {
            self.transformer.flip_horizontal();
        }
        if vertical {
            self.transformer.flip_vertical();
        }
    }

    pub fn grayscale(&mut self) {
        self.transformer.grayscale();
    }

    pub fn blur(&mut self, sigma: f32) {
        self.transformer.blur(sigma)
    }

    pub fn brighten(&mut self, value: i32) {
        self.transformer.brighten(value);
    }

    pub fn contrast(&mut self, value: f32) {
        self.transformer.contrast(value);
    }

    pub fn unsharpen(&mut self, sigma: f32, threshold: i32) {
        self.transformer.unsharpen(sigma, threshold);
    }

    pub fn invert(&mut self) {
        self.transformer.invert();
    }

    /// Post-processing function to export image in an optimal way.
    pub fn optimize(
        &mut self,
        format: &str,
        level: u8,
        interlace: bool,
        optimize_alpha: bool,
    ) -> Vec<u8> {
        let format = Self::get_format(format);

        self.transformer
            .optimize(format, level, interlace, optimize_alpha)
    }

    // Perform the image processing and save the result as a byte vector on this class.
    // Later, the user can call post-processing methods to export the image.
    pub fn exec(&mut self, format: &str) {
        let format = Self::get_format(format);

        self.transformer.exec(format);
    }
}
