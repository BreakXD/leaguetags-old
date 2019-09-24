class routes {

  constructor(base, username, password) {
    if (!base) throw "Invalid base URL..";
    if (!username) throw "Invalid username..";
    if (!password) throw "Invalid password..";
    // Modules
    this.request = require("request");

    // class data
    this.base = base;
    this.username = username;
    this.password = password;
    this.routes = {
      lolchatv1me: "/lol-chat/v1/me", // GERAL
      lolmatchmakingv1readycheck: "/lol-matchmaking/v1/ready-check",
      lolmatchmakingv1readycheckaccept: "/lol-matchmaking/v1/ready-check/accept",
      lollobbyv2receivedinvitations: "/lol-lobby/v2/received-invitations",
      lolsummonerv1currentsummoner: "/lol-summoner/v1/current-summoner",
      lolsummonerv1currentsummonericon: "/lol-summoner/v1/current-summoner/icon",
      lolsummonerv1currentsummonerbackground: "/lol-summoner/v1/current-summoner/summoner-profile",
      lolrankedstatsv1statsByID: "/lol-ranked-stats/v1/current-ranked-stats/",
      lolriotclientRegion: "/riotclient/region-locale",
      lolchatcrasher: "/lol-chat/v1/conversations/",
      lolgameclientchat: "/lol-game-client-chat/v1/instant-messages?"

    }
    this.alias = {
      // lolchatv1me
      reset: this.routes["lolchatv1me"],
      submitTierDivison: this.routes["lolchatv1me"],
      submitTagData: this.routes["lolchatv1me"],
      submitLevel: this.routes["lolchatv1me"],
      submitStatus: this.routes["lolchatv1me"],
      submitLeagueName: this.routes["lolchatv1me"],
      submitAvailability: this.routes["lolchatv1me"],
      submitSummoner: this.routes["lolchatv1me"],
      submitWinsLosses: this.routes["lolchatv1me"],

      //crash
      submitCrash: this.routes["lolchatcrasher"],

      // lolsummoner

      submitIcon: this.routes["lolsummonerv1currentsummonericon"],
      submitBack: this.routes["lolsummonerv1currentsummonerbackground"],

      // lolmatchmakinv1readycheck
      autoAccept: this.routes["lolmatchmakingv1readycheck"],
      accept: this.routes["lolmatchmakingv1readycheckaccept"],

      // lolsummonerv1currentsummoner
      localSummoner: this.routes["lolsummonerv1currentsummoner"],

      // lollobbyv2receivedinvitations
      invDecline: this.routes["lollobbyv2receivedinvitations"],

      // lolriotclientRegion
      submitRegion: this.routes["lolriotclientRegion"],

      // lolgameclientchat
      submitInstantMsg: this.routes["lolgameclientchat"],

      // lolrankedstatsv1statsByID:
      getRankedStats: function(instance, id) {
        return instance.routes["lolrankedstatsv1statsByID"] + id
      }
    }
  }

  setAPIBase(base) {
    this.base = base;
  }

  getAPIBase() {
    return this.base;
  }

  get(body, callback) {
    body.url = this.base + body.url;
    console.log(body);
    return this.request.get(body, callback);
  }

  post(body, callback) {
    body.url = this.base + body.url;
    console.log(body);
    return this.request.post(body, callback);
  }

  put(body, callback) {
    body.url = this.base + body.url;
    console.log(body);
    return this.request.put(body, callback);
  }

  getAuth() {
    return "Basic " + (new Buffer(this.username + ":" + this.password).toString("base64"));
  }

  Route(alias, id) {
    let route = id ? this.alias[alias](this, id) : this.alias[alias];
    if (!route) throw "Invalid alias.";
    //console.log("Route is: " + route)
    return this.base + route;
  }
}

module.exports = routes;