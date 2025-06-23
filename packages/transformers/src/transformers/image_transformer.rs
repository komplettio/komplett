use ::image::{DynamicImage, ImageFormat, ImageReader};
use core::panic;
use oxipng::Interlacing;
use std::io::Cursor;
use wasm_bindgen::prelude::*;

use crate::js;
use crate::transformers;

#[derive(Debug, Copy, Clone, PartialEq)]
pub enum ImageRotation {
    Degrees90 = 90,
    Degrees180 = 180,
    Degrees270 = 270,
}

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

        js::log("Successfully imported image data.");
        self.data = Some(image);
    }

    pub fn export(&mut self, format: ImageFormat) -> Vec<u8> {
        js::log("Exporting image data...");

        let img = self.data.take().expect("No image data to export");
        let mut buffer = Cursor::new(Vec::new());

        if format == ImageFormat::Jpeg || format == ImageFormat::Jpeg {
            // remove the alpha channel if it exists
            // TODO: Make the target format configurable
            let img_buffer = img.to_rgb16();
            img_buffer
                .write_to(&mut buffer, format)
                .expect("Failed to write image");
        } else {
            // TODO: Make the target format configurable
            let img_buffer = img.to_rgba16();
            img_buffer
                .write_to(&mut buffer, format)
                .expect("Failed to write image");
        }

        buffer.into_inner()
    }

    pub fn resize(
        &mut self,
        width: u32,
        height: u32,
        maintain_aspect_ratio: bool,
        filter: image::imageops::FilterType,
    ) {
        self.chain(move |img, _| {
            js::log(&format!("Resizing image to {}x{}...", width, height));
            if maintain_aspect_ratio {
                return img.resize(width, height, filter);
            } else {
                return img.resize_exact(width, height, filter);
            };
        })
    }

    pub fn crop(&mut self, x: u32, y: u32, width: u32, height: u32) {
        self.chain(move |img, _| {
            js::log(&format!(
                "Cropping image to {}x{} at ({}, {})...",
                width, height, x, y
            ));
            img.crop_imm(x, y, width, height)
        });
    }

    pub fn rotate(&mut self, degrees: ImageRotation) {
        self.chain(move |img, _| {
            js::log(&format!("Rotating image by {} degrees...", degrees as u32));
            if degrees == ImageRotation::Degrees90 {
                img.rotate90()
            } else if degrees == ImageRotation::Degrees180 {
                img.rotate180()
            } else if degrees == ImageRotation::Degrees270 {
                img.rotate270()
            } else {
                panic!(
                    "{}",
                    &format!("Unsupported rotation angle: {} degrees", degrees as u32)
                );
            }
        });
    }

    pub fn flip_horizontal(&mut self) {
        self.chain(|img, _| {
            js::log("Flipping image horizontally...");
            img.fliph()
        });
    }

    pub fn flip_vertical(&mut self) {
        self.chain(|img, _| {
            js::log("Flipping image vertically...");
            img.flipv()
        });
    }

    pub fn grayscale(&mut self) {
        self.chain(|img, _| {
            js::log("Converting image to grayscale...");
            img.grayscale()
        });
    }

    pub fn blur(&mut self, sigma: f32) {
        self.chain(move |img, _| img.blur(sigma));
    }

    pub fn brighten(&mut self, amount: i32) {
        self.chain(move |img, _| {
            js::log(&format!("Brightening image by {}...", amount));
            img.brighten(amount)
        });
    }

    pub fn contrast(&mut self, amount: f32) {
        self.chain(move |img, _| {
            js::log(&format!("Adjusting contrast by {}...", amount));
            img.adjust_contrast(amount)
        });
    }

    pub fn unsharpen(&mut self, sigma: f32, threshold: i32) {
        self.chain(move |img, _| {
            js::log(&format!(
                "Applying unsharp mask with sigma {} and threshold {}...",
                sigma, threshold
            ));
            img.unsharpen(sigma, threshold)
        });
    }

    pub fn invert(&mut self) {
        self.chain(|mut img, _| {
            js::log("Inverting image colors...");
            img.invert();
            img
        });
    }

    /// Post-processing function to export image in an optimal way.
    pub fn optimize(
        &mut self,
        format: ImageFormat,
        level: u8,
        interlace: bool,
        optimize_alpha: bool,
    ) -> Vec<u8> {
        if format == ImageFormat::Png {
            js::log("Optimizing PNG image...");
            let image = self.data.take().expect("No image data to optimize");

            // get a png buffer
            let mut buffer = Cursor::new(Vec::new());
            image
                .write_to(&mut buffer, ImageFormat::Png)
                .expect("Failed to write image");
            let png = buffer.into_inner();

            // Oxipng optimization
            let mut options = oxipng::Options::from_preset(level);
            options.interlace = Some(if interlace {
                Interlacing::Adam7
            } else {
                Interlacing::None
            });
            options.optimize_alpha = optimize_alpha;

            let res = oxipng::optimize_from_memory(&png, &options).unwrap_throw();

            return res;
        } else {
            js::log("Skipping optimization for non-PNG image format.");
            return self.export(format);
        }
    }
}
