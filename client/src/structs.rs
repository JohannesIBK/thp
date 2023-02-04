use serde::Serialize;

#[derive(Serialize)]
pub(crate) struct LoginRequest<'a> {
    pub username: &'a str,
    pub password: &'a str,
}


#[derive(Serialize)]
pub(crate) struct WinRequest<'a> {
    pub player: &'a str,
    pub phase: String,
    pub round: i8,
}

#[derive(Serialize)]
pub(crate) struct KillRequest<'a> {
    pub killer: &'a str,
    pub killed: &'a str,
    pub phase: String,
    pub round: i8,
}