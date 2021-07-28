const prompt = require("prompt-sync")();
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();

// variables
var empty = "--";
var table = new Array(
  [empty, empty, empty],
  [empty, empty, empty],
  [empty, empty, empty]
);
var inGame = false;
var queue = new Array("X", "Y");
var regex = "^[0-2]$";
var players = [];
const print = (channel) => {
  table.forEach((element, index) => {
    channel.send("|" + element[0] + "|" + element[1] + "|" + element[2] + "|");
  });
};

const move = (channel, player, move) => {
  table[move[0]][move[1]] = player;

  queue.push(queue.shift());
  players.push(players.shift());

  var winner = check();
  if (winner) {
    print(channel);
    channel.send(players[1].toString() + " is the winner!");
    inGame = false;
  }

  return 1;
};

const check = () => {
  // horizontal
  var sumX = 0;
  var sumY = 0;
  table.forEach((element, index) => {
    element.forEach((element, index) => {
      if (element == "X") sumX++;
      else if (element == "Y") sumY++;
    });
  });
  if (sumX == 3) return "X";
  else if (sumY == 3) return "Y";

  // vertical
  sumX = 0;
  sumY = 0;
  for (var i = 0; i < 3; i++) {
    if (table[0][i] == "X" && table[1][i] == "X" && table[2][i] == "X") {
      return "X";
    } else if (table[0][i] == "Y" && table[1][i] == "Y" && table[2][i] == "Y") {
      return "X";
    }
  }
  // diagonal
  var diagonal = "";
  diagonal = "".concat(table[0][0], table[1][1], table[2][2]);
  if (diagonal == "XXX") return "X";
  else if (diagonal == "YYY") return "Y";

  diagonal = "".concat(table[0][2], table[1][1], table[2][0]);
  if (diagonal == "XXX") return "X";
  else if (diagonal == "YYY") return "Y";

  return null;
};

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send("Pong.");
  }
  ///////////////////////////////////////////////
  else if (command === "args-info") {
    if (!args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    }

    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  }
  ///////////////////////////////////////////////
  else if (
    command == "play" &&
    message.mentions.users.array().length != 0 &&
    inGame == false
  ) {
    players[0] = message.author;
    players[1] = message.mentions.users.array()[0];
    if (players[1].bot) {
      return message.channel.send("You can't fight a bot!");
    }
    //console.log(players[1]);
    message.channel.send(`You have challanged ${players[1].toString()}`);
    message.channel.send("Let's starts the game!");
    print(message.channel);
    inGame = true;
    return message.channel.send(`Next move:${players[0].toString()}`);
  }
  ///////////////////////////////////////////////
  else if (command == "m" && inGame && message.author.id == players[0].id) {
    if (args.length != 2) {
      return message.channel.send("You need to pass only 2 arguments");
    }
    if (
      args[0].toString().match(regex) == null ||
      args[1].toString().match(regex) == null ||
      table[args[0]][args[1]] != empty
    ) {
      return message.channel.send("Wrong move");
    }
    move(message.channel, queue[0], args);
    if (inGame) {
      print(message.channel);
      return message.channel.send(`Next move: ${players[0].toString()}`);
    }
  }
  ///////////////////////////////////////////////
  else if (command == "reset" && message.author.id == "307477851299643392") {
    players.length = 0;
    inGame = false;
    return message.channel.send("The game has been reseted");
  }
});

client.login(token);
