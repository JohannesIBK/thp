#[derive(PartialEq)]
pub enum Error {
    Reqwest(String),
    Api
}

pub type Result<T> = std::result::Result<T, Error>;


impl From<reqwest::Error> for Error {
    fn from(value: reqwest::Error) -> Self {
        Self::Reqwest(value.to_string())
    }
}