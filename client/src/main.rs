use std::{
    io,
    io::Write,
};

use env_logger::Env;
use lazy_static::lazy_static;
use log::info;
use regex::Regex;

use crate::error::{Error, Result};
use crate::handlers::{HttpClient, MinecraftClient};

mod handlers;
mod structs;
mod error;

lazy_static! {
    static ref ACTION_REGEX: Regex = Regex::new(r"Player for -r-(((start)-([a-zA-Z0-9]{1,16})-([0-9]))|(stop)) not found").unwrap();
    static ref WIN_REGEX: Regex = Regex::new(r"([a-zA-Z0-9_]{3,16}) won SkyWars").unwrap();
    static ref KILL_REGEX: Regex = Regex::new(r"([a-zA-Z0-9_]{3,16}) was killed by ([a-zA-Z0-9_]{3,16})").unwrap();
}

fn handler() -> Result<()> {
    let mut minecraft_handler = MinecraftClient::new();
    let mut http_handler = HttpClient::new();

    loop {
        let mut username = String::new();
        let mut password = String::new();

        print!("Username: ");
        io::stdout().flush().unwrap();
        io::stdin().read_line(&mut username).unwrap();
        print!("Password: ");
        io::stdout().flush().unwrap();
        io::stdin().read_line(&mut password).unwrap();

        if http_handler.login("johannes", "12345678").is_ok() {
            info!("You're successfully logged in.");
            break;
        }
    }

    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    loop {
        minecraft_handler.read_file();

        for action in minecraft_handler.action_logs.iter() {
            if let Some(r) = ACTION_REGEX.captures(action) {
                if r.get(3).is_some() {  // Start command
                    let phase = r.get(4).unwrap().as_str();
                    let round = r.get(5).unwrap().as_str().parse::<i8>().unwrap();

                    http_handler.set_round(phase.to_string(), round);
                } else if r.get(6).is_some() {  // End command
                    http_handler.end_round();
                }
            }
        }

        for skywars in minecraft_handler.skywars_logs.iter() {
            if let Some(r) = KILL_REGEX.captures(skywars) {
                http_handler.send_kill(r.get(1).unwrap().as_str(), r.get(2).unwrap().as_str());
            } else if let Some(r) = WIN_REGEX.captures(skywars) {
                http_handler.send_win(r.get(1).unwrap().as_str());
            }
        }

        minecraft_handler.clear_state();
    }
}

fn main() {
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();
    info!("Initializing THP Client...");

    match handler() {
        Ok(_) => {}
        Err(e) => {
            if let Error::Reqwest(e) = e { println!("Reqwest error: {e}") }
        }
    }
}
