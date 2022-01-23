#define CURL_STATICLIB
#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include <iostream>
#include <windows.h>
#include <Lmcons.h>
#include <regex>
#include "curl/curl.h"
#include "rapidjson/document.h"
#include "rapidjson/writer.h"
#include "rapidjson/stringbuffer.h"


#define URL "https://thp-dashboard.greuter.dev"

using namespace std;
using namespace rapidjson;

class HttpClient {
    string g_token;
    string phase;
    int round = -1;

private:
    bool IsSetUp() {
        return round != -1 && !g_token.empty() && !phase.empty();
    }

    static size_t WriteCallback(char* contents, size_t size, size_t nmemb, void* userp) {
        ((std::string*)userp)->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

public:
    void setRoundData(int _round, string _phase) {
        if (_round - 1 < 0) {
            round = 0;
        }
        else {
            round = _round - 1;
        }
        phase = std::move(_phase);
    }

    void EndRound() {
        round = -1;
        phase.clear();
    }

    bool SendLogin(const string& username, const string& password) {
        CURL* curl;
        string response;
        string body = R"({"username":")" + username + R"(", "password":")" + password + "\"}";

        string url;
        url.append(URL);
        url.append("/api/client/login");

        struct curl_slist* list = nullptr;
        list = curl_slist_append(list, "Content-Type: application/json");
        list = curl_slist_append(list, "Accept: application/json");

        curl = curl_easy_init();
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, list);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

        curl_easy_perform(curl);

        curl_easy_cleanup(curl);
        curl_slist_free_all(list);
        curl_global_cleanup();

        Document d;
        d.Parse(response.c_str());
        if (d.HasMember("token")) {
            Value& token = d["token"];
            this->g_token = token.GetString();
            return true;
        }
        else if (d.HasMember("message")) {
            Value& message = d["message"];
            std::cout << message.GetString() << std::endl;
        }
        return false;
    }

    void SendKill(const string& killed, const string& killer) {
        if (!IsSetUp()) {
            return;
        }

        Document d;
        Document::AllocatorType& alloc = d.GetAllocator();

        d.SetObject();

        Value _killer(killer.c_str(), alloc);
        Value _killed(killed.c_str(), alloc);
        Value _phase(phase.c_str(), alloc);
        d.AddMember("killer", _killer, alloc);
        d.AddMember("killed", _killed, alloc);
        d.AddMember("phase", _phase, alloc);
        d.AddMember("round", round, alloc);

        StringBuffer strbuf;
        Writer<StringBuffer> writer(strbuf);
        d.Accept(writer);

        string url;
        url.append(URL);
        url.append("/api/client/kill");

        CURL* curl;
        string response;

        string auth_header = "authorization: ";
        auth_header.append(g_token);

        struct curl_slist* list = nullptr;
        list = curl_slist_append(list, "Content-Type: application/json");
        list = curl_slist_append(list, "Accept: application/json");
        list = curl_slist_append(list, auth_header.c_str());

        curl = curl_easy_init();
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, strbuf.GetString());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, list);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

        curl_easy_perform(curl);

        curl_easy_cleanup(curl);
        curl_slist_free_all(list);
        curl_global_cleanup();
    }

    void SendWin(const string& player) {
        if (!IsSetUp()) {
            return;
        }

        Document d;
        Document::AllocatorType& alloc = d.GetAllocator();

        d.SetObject();

        Value _player(player.c_str(), alloc);
        Value _phase(phase.c_str(), alloc);
        d.AddMember("player", _player, alloc);
        d.AddMember("phase", _phase, alloc);
        d.AddMember("round", round, alloc);

        StringBuffer strbuf;
        Writer<StringBuffer> writer(strbuf);
        d.Accept(writer);

        string url;
        url.append(URL);
        url.append("/api/client/win");

        CURL* curl;
        string response;

        string auth_header = "authorization: ";
        auth_header.append(g_token);

        struct curl_slist* list = nullptr;
        list = curl_slist_append(list, "Content-Type: application/json");
        list = curl_slist_append(list, "Accept: application/json");
        list = curl_slist_append(list, auth_header.c_str());

        curl = curl_easy_init();
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, strbuf.GetString());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, list);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

        curl_easy_perform(curl);

        curl_easy_cleanup(curl);
        curl_slist_free_all(list);
        curl_global_cleanup();
    }
};

class MinecraftHandler {
private:
    string file_path;
    FILE* log_file{};
    char os_user[UNLEN + 1];
    vector<string> skywars;
    vector<string> actions;
    long read_index = 0;

public:
    bool exit_reading = false;

    vector<string> GetSkyWars() {
        return skywars;
    }

    vector<string> GetActions() {
        return actions;
    }

    void ClearLines() {
        skywars.clear();
        actions.clear();
    }

    void GetOSUser() {
        DWORD size = UNLEN + 1;
        GetUserName(os_user, &size);
    }

    void GetFilePath(bool uses_bac) {
        GetOSUser();

        if (uses_bac) {
            file_path.append(R"(C:\Users\)");
            file_path.append(os_user);
            file_path.append(R"(\AppData\Roaming\.minecraft\logs\blclient\minecraft\latest.log)");
        }
        else {
            file_path.append(R"(C:\Users\)");
            file_path.append(os_user);
            file_path.append(R"(\AppData\Roaming\.minecraft\logs\latest.log)");
        }
    }

    bool OpenFile() {
        log_file = fopen(file_path.c_str(), "r");

        if (!log_file) {
            cout << "Die Logfile konnte nicht geöffnet werden." << endl;
            exit(2);
        }

        return true;
    }

    void SetFilePointer() {
        while (fgetc(log_file) != EOF) {}
        read_index = ftell(log_file);
    }

    void ReadMinecraftChat() {
        fseek(log_file, read_index, 0);

        wchar_t ch;
        int str_len = 0;
        bool skip_line = false;
        string line;

        while ((ch = fgetc(log_file)) != WEOF) {
            str_len++;

            if (str_len == 1 && ch != '[') {
                printf("%c\n", ch);
                skip_line = true;
            }



            if (ch == '\n') {
                if (!skip_line) {
                    line.erase(0, 11);
                    if (line.rfind("[Client thread/INFO]: [CHAT] [SkyWars] ", 0) == 0) {
                        line.erase(0, 39);
                        skywars.push_back(line);
                    }
                    else if (line.rfind("[Client thread/INFO]: [CHAT] [Freunde] ", 0) == 0) {
                        line.erase(0, 29);
                        actions.push_back(line);
                    }
                }

                skip_line = false;
                str_len = 0;
                line.clear();
                continue;
            }

            if (!skip_line)
                line += ch;

        }

        read_index = ftell(log_file);
    }
};

class InputHandler {
public:
    bool uses_bac = false;

    static vector<string> GetLoginCredentials() {
        vector<string> credentials;
        string buffer;

        cout << "Username:";
        cin >> buffer;
        credentials.push_back(buffer);
        cout << "Password:";
        cin >> buffer;
        credentials.push_back(buffer);

        return credentials;
    }

    bool AskUsesBAC() {
        char bac = '?';

        do {
            cout << "Spielst du mit BAC? [yn]:";
            cin >> bac;
        } while (bac != 'n' && bac != 'y');

        uses_bac = bac == 'y';
        return uses_bac;
    }

};


int main() {
    regex KILL_REGEX = regex("([a-zA-Z0-9_]{3,16}) wurde von ([a-zA-Z0-9_]{3,16})");
    regex WIN_REGEX = regex("([a-zA-Z0-9_]{3,16}) hat SkyWars gewonnen");
    regex STATUS_REGEX = regex(R"(\[Freunde\] Spieler f.r -r-(((start)-([a-zA-Z0-9]{1,16})-([0-9]))|(stop)) nicht gefunden)");

    HttpClient client;
    InputHandler input{};
    MinecraftHandler minecraft;
    string username;
    string password;
    std::string logPath;

    while (true) {
        vector<string> credentials = InputHandler::GetLoginCredentials();
        bool success = client.SendLogin(credentials.at(0), credentials.at(1));

        if (success) break;
    }

    cout << "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n" << endl;

    input.AskUsesBAC();

    if (input.uses_bac) {
        cout << "Der Pfad fuer den Badlion Client wird verwendet." << endl;
    }
    else {
        cout << "Der normale Minecraft-Pfad wird verwendet." << endl;
    }

    minecraft.GetFilePath(input.uses_bac);
    minecraft.OpenFile();
    minecraft.SetFilePointer();

    std::smatch m;
    string player1, player2;
    string buffer;

    while (true) {
        Sleep(500);
        minecraft.ReadMinecraftChat();
        vector<string> skywars = minecraft.GetSkyWars();
        vector<string> actions = minecraft.GetActions();
        minecraft.ClearLines();

        for (const string& line : actions) {

            regex_search(line, m, STATUS_REGEX);
            if (!m.str(0).empty()) {

                if (m.str(1) == "stop") {
                    cout << "Die Runde wurde beendet." << endl;
                    client.EndRound();
                    break;
                }

                if (m.str(3) == "start") {
                    cout << "Setze Phase " << m.str(4) << " und Runde " << m.str(5) << "." << endl;
                    client.setRoundData(stoi(m.str(5)), m.str(4));
                }
            }
        }

        for (const string& line : skywars) {
            regex_search(line, m, KILL_REGEX);
            if (!m.str(0).empty()) {
                player1 = m.str(1);
                player2 = m.str(2);

                client.SendKill(player1, player2);
                continue;
            }

            regex_search(line, m, WIN_REGEX);
            if (!m.str(0).empty()) {
                player1 = m.str(1);

                client.SendWin(player1);
                client.EndRound();
                cout << "Die Runde wurde automatisch beendet, da ein Win erkannt wurde." << endl;
                break;
            }
        }

        if (minecraft.exit_reading) break;
    }

    return 0;
}