pub mod image;

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

    pub fn chain<F>(mut self, action: F) -> Self
    where
        F: FnOnce(S) -> S + 'static,
    {
        self.actions.push_back(Box::new(action));
        self
    }

    pub fn exec(self, initial: S) -> S {
        let res = self
            .actions
            .into_iter()
            .fold(initial, |state, action| action(state));

        res
    }
}
