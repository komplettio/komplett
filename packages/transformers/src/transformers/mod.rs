pub mod image_transformer;

use std::collections::VecDeque;

pub struct Transformer<T, S> {
    pub kind: T,
    data: Option<S>,
    actions: VecDeque<Box<dyn FnOnce(S) -> S>>,
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
        F: FnOnce(S) -> S + 'static,
    {
        self.actions.push_back(Box::new(action));
    }

    pub fn exec(&mut self) -> S {
        let mut state = self
            .data
            .take()
            .expect("failed to execute transformer: No data provided");

        while let Some(action) = self.actions.pop_front() {
            state = action(state);
        }
        state
    }
}
