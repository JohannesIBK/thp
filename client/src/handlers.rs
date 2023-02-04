use std::{env, fs};

use log::{error, warn};
use crate::error::Error;

use crate::structs::{KillRequest, LoginRequest, WinRequest};

pub struct HttpClient {
    token: Option<String>,
    phase: Option<String>,
    round: Option<i8>,
    base_url: &'static str,
}

impl HttpClient {
    pub fn new() -> Self {
        Self {
            token: None,
            phase: None,
            round: None,
            base_url: "http://localhost:3000",
        }
    }

    pub fn end_round(&mut self) {
        self.round = None;
        self.phase = None;
    }

    pub fn set_round(&mut self, phase: String, round: i8) {
        self.round = Some(if round < 2 {
            0
        } else {
            round - 1
        });

        self.phase = Some(phase);
    }

    pub fn login(&mut self, username: &str, password: &str) -> Result<(), Error> {
        let body = LoginRequest { username, password };

        let req_client = reqwest::blocking::Client::new();
        let login_res = req_client
            .post(format!("{}/api/client/login", self.base_url))
            .json(&body)
            .send();

        match login_res {
            Ok(r) => {
                if r.status().is_success() {
                    self.token = Some(r.text().unwrap());
                } else {
                    error!(target: "http", "Could not login: {}", r.text().unwrap());
                }

                Err(Error::Api)
            }
            Err(e) => {
                error!(target: "reqwest", "Error sending login request. Could not reach server.");
                Err(Error::Reqwest(e.to_string()))
            }
        }
    }

    pub(crate) fn send_kill(&self, killed: &str, killer: &str) {
        let data = KillRequest {
            round: self.round.unwrap(),
            phase: self.phase.as_ref().unwrap().clone(),
            killed,
            killer,
        };

        let req_client = reqwest::blocking::Client::new();
        let kill_res = req_client
            .post(format!("{}/api/client/kill", self.base_url))
            .json(&data)
            .bearer_auth(self.token.as_ref().unwrap())
            .send();

        match kill_res {
            Ok(r) => {
                if !r.status().is_success() {
                    error!(target: "http", "An error occurred while sending the kill of {} on {}.", data.killer, data.killed);
                }
            }
            Err(e) => {
                error!(target: "reqwest", "An error occurred while sending a kill:\n\t{}", e.to_string());
            }
        }
    }

    pub(crate) fn send_win(&self, player: &str) {
        let data = WinRequest {
            phase: self.phase.as_ref().unwrap().clone(),
            round: self.round.unwrap(),
            player,
        };

        let req_client = reqwest::blocking::Client::new();
        let win_res = req_client
            .post(format!("{}/api/client/kill", self.base_url))
            .json(&data)
            .bearer_auth(self.token.as_ref().unwrap())
            .send();

        match win_res {
            Ok(r) => {
                if !r.status().is_success() {
                    error!(target: "http", "An error occurred while sending the win of player {} for round {}.", data.player, data.round);
                }
            }
            Err(e) => {
                error!(target: "reqwest", "An error occurred while sending a win:\n\t{}", e.to_string());
            }
        };
    }
}

pub struct MinecraftClient {
    file_path: String,
    current_log_pos: usize,
    pub skywars_logs: Vec<String>,
    pub action_logs: Vec<String>,
}

impl MinecraftClient {
    pub fn new() -> Self {
        let file_path = Self::get_file_path(false);
        Self {
            current_log_pos: 0,
            skywars_logs: Vec::new(),
            action_logs: Vec::new(),
            file_path,
        }
    }

    pub(self) fn get_file_path(uses_bac: bool) -> String {
        let username = env::var("username").unwrap();

        if uses_bac {
            format!(r"C:\Users\{username}\AppData\Roaming\.minecraft\logs\blclient\minecraft\latest.log")
        } else {
            format!(r"C:\Users\{username}\AppData\Roaming\.minecraft\logs\latest.log")
        }
    }

    pub(crate) fn read_file(&mut self) {
        let contents = fs::read_to_string(self.file_path.as_str()).expect("Could not read logfile");
        let lines = contents.lines().collect::<Vec<&str>>();

        let line_count = lines.len();
        if self.current_log_pos > line_count {
            warn!(target: "minecraft", "Last log position is higher than the current line-count.");
            self.current_log_pos = line_count;
            return;
        }

        let new_lines = &lines[self.current_log_pos..];
        for full_line in new_lines.iter() {
            let line = &full_line[11..];

            if let Some(l) = line.strip_prefix("[Render thread/INFO]: [System] [CHAT] [SkyWars] ") {
                self.skywars_logs.push(l.to_string());
            } else if let Some(l) = line.strip_prefix("[Render thread/INFO]: [System] [CHAT] [Friends]") {
                self.action_logs.push(l.to_string());
            }
        }

        self.current_log_pos = line_count;
    }

    pub(crate) fn clear_state(&mut self) {
        self.action_logs.clear();
        self.skywars_logs.clear();
    }
}