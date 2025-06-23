pub mod image_transformer;

use image::ImageFormat;
use std::collections::VecDeque;

use crate::js;

pub struct Transformer<T, S> {
    pub kind: T,
    data: Option<S>,
    actions: VecDeque<Box<dyn FnOnce(S, ImageFormat) -> S>>,
}

impl<T, S> Transformer<T, S> {
    pub fn new(kind: T) -> Self {
        Self {
            kind,
            data: None,
            actions: VecDeque::new(),
        }
    }

    pub fn chain<F>(&mut self, action: F)
    where
        F: FnOnce(S, ImageFormat) -> S + 'static,
    {
        self.actions.push_back(Box::new(action));
    }

    pub fn exec(&mut self, format: ImageFormat) {
        let mut state = self
            .data
            .take()
            .expect("failed to execute transformer: No data provided");

        if self.actions.is_empty() {
            js::log("Transformer has no actions to execute");
            self.data = Some(state);
            return;
        }

        while let Some(action) = self.actions.pop_front() {
            state = action(state, format);
        }
        self.data = Some(state);
        self.actions.clear();
    }
}
