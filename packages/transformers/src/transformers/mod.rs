pub mod image_transformer;

use std::collections::VecDeque;

pub struct Transformer<T, S> {
    pub kind: T,
    actions: VecDeque<Box<dyn FnOnce(S) -> S>>,
}

impl<T, S> Transformer<T, S> {
    pub fn new(kind: T) -> Self {
        Self {
            kind,
            actions: VecDeque::new(),
        }
    }

    pub fn chain<F>(&mut self, action: F)
    where
        F: FnOnce(S) -> S + 'static,
    {
        self.actions.push_back(Box::new(action));
    }

    pub fn exec(&mut self, initial: S) -> S {
        let mut state = initial;
        while let Some(action) = self.actions.pop_front() {
            state = action(state);
        }
        state
    }
}
