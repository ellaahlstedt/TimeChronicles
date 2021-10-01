"use strict";
/** Get a random element in an array. */
function chooseRandomElement(array) {
    if (array.length === 0) {
        throw new Error('Array must contain at least 1 element');
    }
    return array[Math.floor(Math.random() * array.length)];
}
/**Creates a valid game data object.
 *
 * Set up all game specific data, all of this data will be saved automatically. */
function generateGameData() {
    // Just add new things to the returned object and they will be automatically saved.
    // Note: any functions stored inside this object should represent scenes, otherwise saving data will fail.
    return {
        /** The inventory of the player. */
        inventory: {
            timeArtifact: true,
            invisibilityCloak: false,
            spiderKey: false,
        },
        /** The current scene. */
        scene: scenes.intro,
        previousScene: scenes.intro,
        /** Specifies which password is the correct one. */
        randomPasswordIndex: Math.floor(Math.random() * 5),
        /** Determines what happens if you enter the castle dungeons. */
        randomDungeonsScene: chooseRandomElement([scenes.dungeonsDesolate, scenes.dungeonsSpiders]),
        /** Used to update page numbers. */
        pageFlipCount: 1,
        /** Number of times you have guessed the password. */
        passwordGuessesMade: 0,
        /** The index of the password that you guessed last time. */
        guessedPassword: 0,
        hasKnockedOnPasswordGate: false,
        /** Lost leroy at entrance to dragon. */
        leroyGone: false,
        /** Choose to go to dungeons from main gate. */
        enteredDungeons: false,
        /** Data that should be stored longer than a single game. */
        statistics: {
            totalPagesTurned: 0,
            gamesCompleted: 0,
            gamesStarted: 0,
            /** Each key is a sceneId for a final scene and the value of each key is the number of times that ending was encountered. */
            finalScenes: {},
        },
    };
}
/** Access or modify the inventory. */
let inventory = {
    add: function (item) {
        gameData.inventory[item] = true;
    },
    contains: function (item) {
        return gameData.inventory[item];
    },
    remove: function (item) {
        gameData.inventory[item] = false;
    },
};
let spiderKeyName = `1F`;
function createArtifactChamberScene(isKnocking, justGotRejected) {
    let isFinalGuess = gameData.passwordGuessesMade >= 1;
    function getRandomResult(index) {
        if (index === gameData.randomPasswordIndex) {
            return scenes.timeArtifact;
        }
        else if (isFinalGuess) {
            // Battle?
            return scenes.todo;
        }
        else {
            return scenes.artifactChamberRejection;
        }
    }
    let options = [
        {
            text: "Speak the password “Warped matter”.",
            scene: getRandomResult(0),
        },
        {
            text: "Speak the password “More time to stop the key from turning”",
            scene: getRandomResult(1),
        },
        {
            text: "Speak the password “Justify the four-dimensional branches”",
            scene: getRandomResult(2),
        },
        {
            text: "Speak the password “Portus”.",
            scene: getRandomResult(3),
        },
        {
            text: "Speak the password “Second parallel timeline”",
            scene: getRandomResult(4),
        },
        {
            text: "Password? Just knock on the gate.",
            scene: scenes.artifactChamberKnocking,
            enabled: !isKnocking && !gameData.hasKnockedOnPasswordGate,
            sideEffects: function () {
                gameData.hasKnockedOnPasswordGate = true;
            },
        },
        {
            text: "Turn away from the gate to search elsewhere.",
            scene: scenes.stairs,
        },
    ];
    options[gameData.randomPasswordIndex].text += ` [DEBUG: Correct]`;
    // Remember the option that we click on:
    for (let i = 0; i < 5; i++) {
        options[i].sideEffects = function () {
            gameData.guessedPassword = i;
            gameData.passwordGuessesMade++;
        };
    }
    if (isFinalGuess) {
        // Remove the option that was guessed previously:
        options.splice(gameData.guessedPassword, 1);
    }
    let title = `Infiltrating the castle - artifact chamber`;
    let desc = `You come before a gate demanding a password for access to its contents. Many words and phrases that you’ve picked up from observations throughout the castle crosses your mind, but you are hesitant to propose any incorrect password given the risk of disallowance to pass should you lack information or misinterpret the key to this lock more than ${isFinalGuess ? `you have already done last time` : "once"}. You:`;
    if (isKnocking) {
        title = `Infiltrating the castle - artifact chamber - Go knocking`;
        desc = `You knock on the gate, but nothing happens. You knock again and this time with all your might as hard as you can, but alas, it’s to no effect...Reconsidering everything, you:`;
    }
    if (justGotRejected) {
        title = `Infiltrating the castle - Artifact chamber - Access denied`;
        desc = `The door reacts disapprovingly, keeping itself shut while whispering “Access denied!”. Considering a final attempt to unlock this gate, you:`;
    }
    return {
        title,
        desc,
        options,
        backImg: "./img/gate.jpg",
    };
}
let scenes = {
    loadGame: function () {
        let options = [
            {
                text: `New Game`,
                scene: scenes.intro,
                sideEffects: function () {
                    loadedGameData = null;
                }
            },
        ];
        if (loadedGameData) {
            let gameDataToLoad = loadedGameData;
            options.push({
                text: `Load Game`,
                scene: gameDataToLoad.scene,
                sideEffects: function () {
                    let stats = gameData.statistics;
                    gameData = gameDataToLoad;
                    // After the game has loaded it will store `scene` into `previousScene`, so this will correctly remember the previous scene:
                    gameData.scene = gameData.previousScene;
                    // Ensure we never forget stats:
                    gameData.statistics = stats;
                    loadedGameData = null;
                },
            });
        }
        return {
            title: `Time Chronicles`,
            desc: ``,
            options,
            backImg: "./img/mainBg.jpg",
        };
    },
    intro: function () {
        return {
            title: 'Introduction',
            desc: `You’re a wizard in a group of adventures undertaking quests. When you awake in your inn one day, after a particularly gruelling quest, you find a letter claiming to be written by yourself even though you have no memory of writing such a thing. In the letter there is a strange artifact that can allegedly bring anyone who activates it back in time. The letter claims that you must go and retrieve the same artifact from where it was originally stored and then travel back in time to put together this letter in order for the space-time continuum to remain stable.`,
            options: [
                {
                    text: "Nonsense! You don’t believe in any of this! You should investigate if this artifact even does anything at all.",
                    scene: scenes.avoidScam,
                },
                {
                    text: "This sounds pretty serious! You should bring this letter and the artifact to your companions and see if they have any insights.",
                    scene: scenes.companions,
                }
            ],
            backImg: "./img/inn.png",
        };
    },
    companions: function () {
        return {
            title: `Companions`,
            desc: `Entering the bar in which the companions of yours reside, you hastily gather your party to announce the conspicuous quest. Given your history of embarking on many dangerous quests in this company before, it comes as no surprise that they’re willing to undertake this one right away. The letter addresses the location of the sought artifact, a great castle in the woods not too far from where you currently are, so that’s where you along with your companions will be heading next.`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.castleEntry,
                }
            ],
            backImg: "./img/bar.jpg",
        };
    },
    avoidScam: function () {
        return {
            title: `Avoiding scams`,
            desc: `As you begin trying to interact with the artifact, running your fingers along the clock-like design, you quickly notice the room darkening and you can see the night sky through a window. Unless this is a powerful illusion then this artifact seems to have actually turned back time. So it wasn't really a trick, was it? Confounded with having your only reasonable expectations broken, you decide to:`,
            options: [
                {
                    text: "Take this quest alone.",
                    scene: scenes.todo,
                    enabled: false,
                },
                {
                    text: "Involve your companions by consulting them about this suspiciously potential scam to an intriguing quest anyway.",
                    scene: scenes.companions,
                },
                {
                    text: "Turn down this quest entirely.",
                    scene: scenes.endingPhantomTrick,
                    enabled: inventory.contains("timeArtifact"),
                },
            ],
            backImg: "./img/innNight.png",
        };
    },
    endingPhantomTrick: function () {
        return {
            title: `Ending - The phantom trick`,
            desc: `Convinced the quest is a treacherous waste of time, you move on, business as usual. Some time shortly thereafter, you’re approached by a cloaked figure, it turns dark and you feel no more.`,
            options: [
                {
                    text: "The end",
                    scene: scenes.end,
                }
            ],
        };
    },
    castleEntry: function () {
        return {
            title: `Infiltrating the castle - Entry`,
            desc: `Once at the site, you notice two distinct ways of entering the castle. The front gate stands open but ominous shadows surround it, is there someone there? The dungeons is the other entrance, located in the midst of ruins nearby the castle, perhaps it can give you as well as anything else a stronger cover.`,
            options: [
                {
                    text: "Enter front gate.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Enter dungeons.",
                    scene: gameData.randomDungeonsScene,
                    sideEffects: function () {
                        gameData.enteredDungeons = true;
                    },
                },
                {
                    text: "Listen for signs of danger.",
                    scene: scenes.entryInspection,
                }
            ],
            backImg: "./img/castleDay.png",
        };
    },
    entryInspection: function () {
        let randomDungeonsInspection;
        if (gameData.randomDungeonsScene === scenes.dungeonsDesolate) {
            randomDungeonsInspection = ' The dungeons quietly sound with dripping liquids.';
        }
        else {
            randomDungeonsInspection = ' The dungeons echo with many light footsteps in bursts.';
        }
        return {
            title: 'Infiltrating the castle - Inspection of entry',
            desc: `Taking the time not to run in blind, you listen very closely for any signs of what’s happening in there. You hear the sound of a faint breath and sense heat in irregular waves from the front gate.` + randomDungeonsInspection,
            options: [
                {
                    text: "Enter front gate.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Enter dungeons.",
                    scene: gameData.randomDungeonsScene,
                }
            ],
            backImg: "./img/castleDay.png",
        };
    },
    frontGate: function () {
        return {
            title: 'Infiltrating the castle - Front gate',
            desc: `Determined to enter this place head on, your firm warrior Leroy charges ahead into the main hallway with a fierce battle cry!
            With any sense of suddulty gone, you've catched the attention of a dragon, leaving you with no choice but to:`,
            options: [
                {
                    text: "Engage the dragon in combat.",
                    scene: scenes.dragonFight,
                },
                {
                    text: "Perform a tactical retreat.",
                    scene: scenes.dragonRetreat,
                    sideEffects: function () {
                        gameData.leroyGone = true;
                    },
                }
            ],
            backImg: "./img/frontgate.png",
        };
    },
    dragonFight: function () {
        return {
            title: `Infiltrating the castle - Fight the dragon`,
            desc: `An intense fight breaks out, arrows fly and fireballs are hurled. It continues until you are near exhausted but finally the dragon lies dead. Hopefully no one heard that…

Anyways, time to continue onwards!`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/frontgate.png",
        };
    },
    dragonRetreat: function () {
        return {
            title: 'Infiltrating the castle - Flee the dragon',
            desc: `You shout “Run you fools!” and turn to seek shelter. Unfortunately Leroy doesn’t hear since he already charged right at the dragon. Your other companions seem to follow your lead however and are also turning to run away. Anyways, it is too late to change your mind now, Leroy will just have to save himself…

In the chaos that follows you find yourself deeper in the castle with your other companions. You don’t know what happened to Leroy, but you hope he got away from the castle. Whatever may be the case, you must continue on your quest.`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/frontgate.png",
        };
    },
    dungeonsDesolate: function () {
        return {
            title: 'Infiltrating the castle - Dungeons',
            desc: `Committing to what appears to be a stealthier route, you go downwards towards the dimly lit and seemingly desolate dungeons. The treversal goes smoothly and you spot something different. Engravings on a wall, depicting an odd object on a throne in a rather vague frame. Regardless of what direction may be optimal at one point or another, you proceed to walk the only path before you now that doesn’t turn away from the castle’s chambers.`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/hallway2.png",
        };
    },
    dungeonsSpiders: function () {
        return {
            title: 'Infiltrating the castle - Dungeons',
            desc: `Committing to what appears to be a stealthier route, you go downwards towards the dimly lit and seemingly desolate dungeons. Your treversal here quickly uncovers a threat as a horde of monstrous spiders and other similarly toxic insects ambushes you from all sides! You rush the exit door but as you quickly uncover, it’s locked! May a key not be nearby? Intending to settle this matter one way or another, you:`,
            options: [
                {
                    text: "Venture back in search of a key.",
                    scene: scenes.dungeonsSpidersKey,
                    sideEffects: function () {
                        inventory.add("spiderKey");
                    },
                },
                {
                    text: "Station by the door to ward off incoming waves of hostiles.",
                    scene: scenes.dungeonsHordeDefense,
                },
            ],
            backImg: "./img/dungeon.png",
        };
    },
    dungeonsHordeDefense: function () {
        return {
            title: `Infiltrating the castle - Dungeon hostilities - Hold this position`,
            desc: ``,
            options: [],
        };
    },
    dungeonsSpidersKey: function () {
        return {
            title: 'Infiltrating the castle - Dungeon hostilities - Keys',
            desc: `In your frantic search for a means of exiting this quite literally dark place, you light the way both for exploration and for scorching foes with your fiery spells. Soon enough you do find a pair of keys and one of them appears appropriately old and rusty for this lock you seek to unlock, you return to the exit door with these items to try it. Click! The door opens and you swiftly enter to then shut the door behind you, locking it again to ensure that nothing sinister follows you from underground. Inspecting the other key you just found, you can see that it, aside from its silvery and cleaner appearance, has a small description that reads “${spiderKeyName}”. Without lingering any longer you proceed onwards.`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/dungeon.png",
        };
    },
    stairs: function () {
        let backImg = "./img/staircase2.png";
        if (gameData.previousScene === scenes.throneRoom) {
            backImg = "./img/staircase.png";
        }
        if (gameData.previousScene === scenes.library || scenes.libraryPast) {
            backImg = "./img/staircase3.png";
        }
        return {
            title: `Infiltrating the castle - Stairs`,
            desc: `${gameData.enteredDungeons ? "Having now exited the dungeons, y" : "Y"}ou stand before a set of stairs leading to three different floors. Potential points of interest on these floors are respectively a kitchen, a library and a hallway with many smaller rooms.`,
            options: [
                {
                    text: "Explore first floor.",
                    scene: scenes.throneRoom,
                },
                {
                    text: "Explore second floor.",
                    scene: scenes.library,
                },
                {
                    text: "Explore third floor.",
                    scene: scenes.artifactChamber,
                }
            ],
            backImg,
        };
    },
    library: function () {
        return {
            title: 'Infiltrating the castle - Library',
            desc: `This chamber is filled with books in vast shelves. You suspect clues about the whereabouts of the artifact you’re looking for could be encountered among the historic section which should list what more unique items are stored here. Contemplating whether or not to go for whatever contents and risks that may be found here, you choose to proceed with:`,
            options: [
                {
                    text: "Going through the library.",
                    scene: scenes.libraryClues,
                },
                {
                    text: "Turning away to find another room.",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/library.png",
        };
    },
    libraryClues: function () {
        let passwordHints = [
            "It could be said that warped matter is at the heart of this matter.",
            "Buying time to stop a key from turning is what it's for.",
            "This justice is essential.",
            "This power originates from another secretive art called “Portus” which unlike the time artifact also brings one back in space and seems connected with the construct of portals for better or worse.",
            "parallel",
        ];
        let passwordHint = passwordHints[gameData.randomPasswordIndex];
        return {
            title: 'Infiltrating the castle - Library - Clues',
            desc: `After having traversed the stil environment in a search for the right texts on their corresponding shelves, you attain a book titled “The Unique Entities of Castle Alzheim”, which details the nature of various items confined here including a time artifact. The time artifact is described as a warped matter capable of altering four-dimensional past timelines provided they’re justified in parallel formation and within its range of 24 hours which can’t be offseted. ${passwordHint}
            
            Just as you’re about to leave, a ragged crooked-looking humanoid creature enters the room, instantly beginning to conjure up a horde of undead summons upon noticing your presence. Countering this you:`,
            options: [
                {
                    text: "Charge the main foe",
                    scene: scenes.todo,
                },
                {
                    text: "Fend off the summons.",
                    scene: scenes.todo,
                },
                {
                    text: "Use time artifact.",
                    scene: scenes.libraryPast,
                }
            ],
            backImg: "./img/library.png",
        };
    },
    libraryPast: function () {
        return {
            title: `A peculiar circumvention`,
            desc: `In an instant, the library shifts from a loud emerging battle to completely silent order. Now that you know of a present threat and the somewhat vague insights of the castle’s library, you hastily move away not to get caught in whatever crossfire that may transpire here.
            
            Just as you were about to leave, an approaching guard interrupts. To quickly bypass this you make yourself a distraction, turn back time again, and then sneak past while your previous self distracts the target. After successfully covering yourself you now arrive back at the staircases again`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/hallway.png"
        };
    },
    throneRoom: function () {
        return {
            title: 'Infiltrating the castle - Throne room',
            desc: `The center of attention here is a locked chest upon a pedestal, you figure that to unlock the contraption some kind of puzzle must be solved. Observing your immediate surroundings with this in mind, you notice a pressure plate in the floor and step on it to discover that it moves the position of one mirror in the ceiling and the angle of another mirror by a window to deflect light onto one of the letters of an emblem engraved on the top of the chest’s lid with the word “Alzheim”.`,
            options: [
                {
                    text: "Turning away to find another room.",
                    scene: scenes.stairs,
                },
                {
                    text: `Use mysterious “${spiderKeyName}” Key`,
                    scene: scenes.throneRoomTreasure,
                    enabled: inventory.contains("spiderKey"),
                }
            ],
            backImg: "./img/castleWideRoom.jpg",
        };
    },
    throneRoomTreasure: function () {
        let passwordHints = [
            "warped",
            "time key",
            "justice",
            "portals",
            "parallel",
        ];
        let passwordHint = passwordHints[gameData.randomPasswordIndex];
        return {
            title: `Infiltrating the castle - throne room - reward`,
            desc: `You find an enchanted device which when switched to its active state emits a focused beam of purple light. Perhaps this item could most notably be a debilitating weapon against certain creatures. Trying it out, you spot something written on the inside of the chest’s lid, it says “${passwordHint}”. Having noted your conspicuous findings here, you return to the stairs nearby to continue your search.`,
            options: [
                {
                    text: "Back to the stairs",
                    scene: scenes.stairs,
                },
            ],
        };
    },
    artifactChamber: function () {
        return createArtifactChamberScene(false, false);
    },
    artifactChamberKnocking: function () {
        return createArtifactChamberScene(true, false);
    },
    artifactChamberRejection: function () {
        return createArtifactChamberScene(false, true);
    },
    timeArtifact: function () {
        return {
            title: 'Infiltrating the castle - Artifact:',
            desc: `The door reacts approvingly, opening itself while whispering “Access granted!”, now unveiling the contents. A vase of glass mounted on a frame of an elevated globe in a small thickly isolated room, containing a clock-like object within, identical to the one you received from the letter at the start - the time reversing artifact you were looking for, finally you have it at hand.`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.gotThrough,
                },
            ],
            backImg: "./img/gate.jpg",
        };
    },
    gotThrough: function () {
        return {
            title: 'Got through',
            desc: `You and your companions quickly escape the castle and congratulate each other on another successful quest.${gameData.leroyGone ? ` Well except for Leroy that is, him you can't find anywhere. Perhaps he got so scared he quit being an adventurer? You might never know.` : ``}
            
${gameData.leroyGone ? `Anyway, finally` : `Finally`} having reached the last step of this quest, you prepare an envelope to send back to the past, writing the same text as in the received letter from the start but also stopping to ponder for a moment on what you’d really prefer to do here, eventually going through with:`,
            options: [
                {
                    text: "Putting the stolen artifact in the letter.",
                    scene: scenes.endingNoFunnyIdeas,
                },
                {
                    text: "Putting the artifact you received from the original letter in the new letter.",
                    scene: scenes.keepStolenArtifact,
                },
            ],
            backImg: "./img/houseNight.png"
        };
    },
    endingNoFunnyIdeas: function () {
        return {
            title: 'Don’t get any funny ideas',
            desc: `You just take the letter with the requested artifact and put it back next to the bed that your past self is sleeping in. Feeling relieved to finally have put things back in order you, as well as your companions, leave the village to find new opportunities elsewhere. A couple of days later you can’t find the second time artifact anymore and you assume it has vanished into the time loop it came from. You aren’t disappointed, instead you are relieved to never again have to care about such random absurdities ever again. You are sure nothing bad could possibly come from not investigating these strange events and that no consequences will be had from this adventure.`,
            options: [
                {
                    text: "The end",
                    scene: scenes.end,
                }
            ],
            backImg: "./img/innNight.png"
        };
    },
    keepStolenArtifact: function () {
        return {
            title: 'Ending - Keep the stolen artifact for yourself',
            desc: `You put your original time artifact, the one you got in the letter, back inside the letter and put it next to the bed that your past self is sleeping in. Feeling quite clever and hoping to keep your newly stolen artifact, you and your companions leave the village to find out what shenanigans you can get up to with this newly acquired power. You are sure the time loop will solve itself now that it, at least, has one time artifact.
            
            In the middle of the following night a pair of strangers approach you. They claim to be from the time-correction beuro and that you will perish unless you give up your time artifact. They assure you that if you give them the artifact then they can solve the time loop and ensure your safety.`,
            options: [
                {
                    text: "You know a scam when you see one. No way will you be surrendering your hard earned time artifact to these morons!",
                    scene: scenes.refuseStrangers,
                },
                {
                    text: "Perhaps it was naive to think that you would get out of this mess with something for it. Just give them the artifact and wash your hands from all of this trouble.",
                    scene: scenes.noTrouble,
                }
            ],
            backImg: "./img/villageNight.png"
        };
    },
    noTrouble: function () {
        return {
            title: 'No looking for trouble',
            desc: `Giving these strangers the time artifact as requested, they quickly leave and the troublesome situation seems to be fully resolved as expected. You go home.`,
            options: [
                {
                    text: "The end",
                    scene: scenes.end,
                }
            ],
            backImg: "./img/inn.png"
        };
    },
    refuseStrangers: function () {
        return {
            title: `Refuse strangers`,
            desc: `They seem surprised at your stubborn rejection of their “help” and they call you greedy. They argue among themselves for a couple of minutes and then approach you again. They have decided to appeal towards your greed and offer you a sizable amount of gold if you just give them the time artifact.`,
            options: [
                {
                    text: `Now this is more like it! A deal worth taking! You were tired of this nonsense anyway, and now you get paid to get rid of it!? You certainly are good at making deals. These second rate scam artists have nothing on you.`,
                    scene: scenes.paidDismissal,
                },
                {
                    text: `If they are prepared to pay that much for it so soon then it must certainly be worth a lot more. You don’t become rich by being a fool and you know when there is money to be had. Demand even more gold!`,
                    scene: scenes.artifactBlackmail,
                },
                {
                    text: `Do they take you for an idiot? Obviously you can make a near limitless amount of gold by just using the time artifact yourself. There is no way you will agree to give it away!`,
                    scene: scenes.noDeal,
                }
            ],
            backImg: "./img/villageNight.png"
        };
    },
    paidDismissal: function () {
        return {
            title: 'Paid dismissal',
            desc: `Pleased to strike a resolving deal, you exchange the time artifact for the promised sizable amount of gold. The cloaked strangers thank you for your cooperation and then disappear far from sight along with the time artifact. And so that was the end of that. You may or may not be happy, but more importantly, you are rich.`,
            options: [
                {
                    text: "The end",
                    scene: scenes.end,
                }
            ],
            backImg: "./img/villageNight.png"
        };
    },
    artifactBlackmail: function () {
        return {
            title: 'Ending - Keep the stolen artifact for yourself - Clever blackmail',
            desc: `Countering their offer with your demand to be paid at no hidden discount, they begrudgingly agree to a price sum double that of their initial proposal but still less than the quadruple increase you demanded.`,
            options: [
                {
                    text: "You won’t concede to any half-baked macro-transaction, you only sell a possession such as this at full price.",
                    scene: scenes.todo,
                },
                {
                    text: "That will do, let’s make the deal.",
                    scene: scenes.todo,
                },
            ],
            backImg: "./img/alley.png"
        };
    },
    noDeal: function () {
        return {
            title: `No deal`,
            desc: `Suddenly these scam artists don’t appear to feel so clever anymore with them now realizing that you realize their offerings can’t compare to the possession of a time artifact. However, they now also state, “We’ve been directed by the highest authority to only relinquish supreme power once this crisis is over, we aren’t leaving without this time artifact, hand it over and you will not now perish.”`,
            options: [
                {
                    text: "Comply",
                    scene: scenes.todo,
                },
                {
                    text: "Reject their demand by force",
                    scene: scenes.absolutes,
                }
            ],
            backImg: "./img/villageNight.png"
        };
    },
    absolutes: function () {
        return {
            title: `Absolutes`,
            desc: `Only second rate scam artists deals in absolutes, but now you too will play their game. In a fast flashing exchange of attacks, you emerge victorious as they've fallen with deeply scorched marks. You're safe, for now.
            
            Given all these most suspicious change of events, you can only assume there's more to it, which together with your successful retainment of a time artifact will support your ability to unravel the truth behind the meddling conspiracy. There was this supposed organization called the time-correction beuro, but regardless of precisely who they are and what they really want with the time artifacts you're certain that this power serves a better use in your relatively benevolent hands, all should be revealed in duo time.`,
            options: [
                {
                    text: "The end",
                    scene: scenes.end,
                }
            ],
            backImg: "./img/villageNight.png"
        };
    },
    todo: function () {
        return {
            title: `The Early Access Effect`,
            desc: `We are very sorry but this game is still in development and this part of the story hasn't been finished yet!`,
            options: [
                {
                    text: "The end",
                    scene: scenes.end,
                },
                {
                    text: "New Game",
                    scene: scenes.intro,
                },
                {
                    text: "Continue from previous page",
                    scene: gameData.previousScene,
                }
            ],
            backImg: "./img/mainBg.jpg"
        };
    },
    end: function () {
        let desc = "";
        // Current games page count:
        desc += "Story extent in pages: " + gameData.pageFlipCount + '\n';
        // All games - page count:
        desc += "Total pages turned for all games: " + gameData.statistics.totalPagesTurned + '\n';
        // All games - started:
        desc += "Total games started: " + gameData.statistics.gamesStarted + '\n';
        // All games - finished:
        desc += "Total games finished: " + gameData.statistics.gamesCompleted + '\n';
        // Final scenes (counts of endings):
        desc += "\nEndings:";
        let finalScenes = Object.keys(gameData.statistics.finalScenes);
        for (let finalSceneId of finalScenes) {
            let count = gameData.statistics.finalScenes[finalSceneId];
            let sceneFunction = getSceneFunction(finalSceneId);
            if (sceneFunction && sceneFunction !== scenes.end) {
                let scene = sceneFunction();
                let title = scene.title;
                let times = "time";
                if (count > 1) {
                    times += "s";
                }
                desc += "\n" + title + ": " + count + " " + times;
            }
            else {
                console.warn(`Final scene stats include invalid sceneId "${finalSceneId}".`);
            }
        }
        return {
            title: 'The End',
            desc,
            options: [
                {
                    text: "New Game",
                    scene: scenes.intro,
                },
                {
                    text: "Clear statistics",
                    scene: scenes.end,
                    sideEffects: function () {
                        gameData.pageFlipCount = 0;
                        let defaultStats = generateGameData().statistics;
                        gameData.statistics = defaultStats;
                    },
                },
            ],
            backImg: "./img/mainBg.jpg"
        };
    }
};
/** Get a scene's id as a string. */
function getSceneId(sceneFunction) {
    for (let id of Object.keys(scenes)) {
        if (scenes[id] === sceneFunction) {
            return id;
        }
    }
    return null;
}
/** Get the function that generates the scene specified by an id. */
function getSceneFunction(sceneId) {
    let sceneFunction = scenes[sceneId];
    if (sceneFunction)
        return sceneFunction;
    else
        return null;
}
/** Run the game inside a terminal for some debugging. */
function runInDeno(sceneFunction) {
    while (true) {
        let scene = sceneFunction();
        scene.options = scene.options.filter(function (option) {
            if (option.enabled === undefined)
                return true;
            return option.enabled;
        });
        console.log('   ' + scene.title);
        console.log();
        console.log(scene.desc);
        console.log();
        if (scene.options.length === 1) {
            console.log('Option:');
        }
        else {
            console.log('Options:');
        }
        for (let i = 0; i < scene.options.length; i++) {
            console.log(`${i + 1}. ${scene.options[i].text}`);
        }
        let inputText = prompt("");
        if (inputText === null)
            continue;
        if (inputText.startsWith("skip to ")) {
            let level = inputText.slice("skip to ".length);
            console.log(level);
            let wantedScene = getSceneFunction(level);
            if (!wantedScene) {
                console.warn("The level \"" + level + "\" doesn't exist");
                continue;
            }
            sceneFunction = wantedScene;
            continue;
        }
        if (inputText === "save") {
            console.log("Current scene id: " + getSceneId(sceneFunction));
            continue;
        }
        let inputNumber = parseInt(inputText);
        if (inputNumber === null || isNaN(inputNumber))
            continue;
        inputNumber--;
        if (inputNumber < 0)
            continue;
        if (inputNumber >= scene.options.length)
            continue;
        console.log(`You selected option: `, inputNumber);
        let selectedOption = scene.options[inputNumber];
        if (selectedOption.sideEffects) {
            selectedOption.sideEffects();
        }
        sceneFunction = selectedOption.scene;
    }
}
/** Transfrom a GameData object into a string and save it to the browser. */
function save(gameData) {
    try {
        /** Turn any functions inside the object into strings using getSceneId. */
        function makeSaveData(obj) {
            let saveData = {};
            for (let key of Object.keys(obj)) {
                let value = obj[key];
                if (typeof value === 'function') {
                    // Store functions as strings:
                    let sceneId = getSceneId(value);
                    if (!sceneId) {
                        throw new Error(`Failed to save the scene stored in "${key}" since its scene id could not be determined.`);
                    }
                    saveData[key] = sceneId;
                }
                else if (typeof value === 'object') {
                    if (!value) {
                        // Don't save null or undefined.
                        continue;
                    }
                    // Process any nested objects as well:
                    saveData[key] = makeSaveData(value);
                }
                else {
                    // Otherwise just store the value as it is:
                    saveData[key] = value;
                }
            }
            return saveData;
        }
        let saveText = JSON.stringify(makeSaveData(gameData));
        localStorage.setItem('saveData', saveText);
    }
    catch (error) {
        console.error("Can't save data: ", error);
    }
}
/** Get save data from the browser as a string and transform it into a valid GameData object. */
function load() {
    try {
        let loaded = localStorage.getItem('saveData');
        if (loaded) {
            // Convert loaded string to an object:
            let objectLoadedFromJsonString = JSON.parse(loaded);
            // Get some valid game data that can be updated:
            let gameData = generateGameData();
            /**Updates game data objects from loaded data.
             *
             * Functions in the game data should be represented as strings in the loaded data. */
            function updateGameData(validGameData, loadedData) {
                for (let key of Object.keys(validGameData)) {
                    let originalValue = validGameData[key];
                    let expectedType = typeof originalValue;
                    let loadedValue = loadedData[key];
                    let loadedType = typeof loadedValue;
                    if (expectedType === 'function') {
                        if (loadedType !== 'string') {
                            throw new Error(`Loaded data was corrupt at "${key}", game data scene should be represented by string but was represented by: ` + loadedType);
                        }
                        let sceneFunction = getSceneFunction(loadedValue);
                        if (!sceneFunction) {
                            throw new Error(`Loaded data was corrupt at "${key}", failed to find scene with the id ` + loadedValue);
                        }
                        validGameData[key] = sceneFunction;
                    }
                    else if (loadedType === expectedType) {
                        if (expectedType === 'object') {
                            if (!originalValue || !loadedValue) {
                                // Ignore null or undefined.
                                continue;
                            }
                            // This key stores a nested object, update that the same way:
                            updateGameData(originalValue, loadedValue);
                        }
                        else {
                            if (expectedType === 'number') {
                                if (isNaN(loadedValue)) {
                                    // Ignore NaN numbers (we probably can't use them correctly anyway):
                                    continue;
                                }
                            }
                            validGameData[key] = loadedValue;
                        }
                    }
                    else {
                        throw new Error(`Loaded data was corrupt at "${key}", expected type ${expectedType} but found ${loadedType}`);
                    }
                }
                // Add any new keys to the object:
                for (let loadedKey of Object.keys(loadedData)) {
                    if (validGameData[loadedKey] === undefined) {
                        // New key that doesn't exist in valid game data. New keys should not cause problems for game code:
                        validGameData[loadedKey] = loadedData[loadedKey];
                    }
                }
            }
            // Update valid game data with loaded data:
            updateGameData(gameData, objectLoadedFromJsonString);
            // Return the updated game data:
            return gameData;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Can't load save data: ", error);
        return null;
    }
}
/** Only true when starting the game right after the page has loaded. */
let firstFlip = true;
/** A number that is unique to the current scene, ensures options are always related to the current scene. */
let sceneUniqueId = 0;
/** If true then we are currently animating the book, do not allow another option to be selected yet. */
let flipAnimationInProgress = false;
/** The user made a choice while animation was playing, apply as soon as possible. */
let latestOptionChoice = null;
/** The div tag that contains the current scene's background image. Used to transition smoothly between background images. */
let currentBackgroundImage = null;
/** Make a choice based on a keyboard event. */
let keyboardHandler = null;
function runInBrowser(sceneFunction) {
    // Any previous choices are not valid for the new scene:
    latestOptionChoice = null;
    // Ensure we keep game data updated:
    gameData.previousScene = gameData.scene;
    gameData.scene = sceneFunction;
    if (sceneFunction === scenes.intro) {
        // Reset all game data when going back to first scene:
        let stats = gameData.statistics;
        gameData = generateGameData();
        // Keep stats:
        gameData.statistics = stats;
    }
    if (sceneFunction === scenes.loadGame) {
        // Main menu:        
        gameData.pageFlipCount = 0;
    }
    let sceneId = getSceneId(sceneFunction);
    let scene = sceneFunction();
    scene.options = scene.options.filter(function (option) {
        if (option.enabled === undefined)
            return true;
        else
            return option.enabled;
    });
    // Store stats about final scenes:
    let isFinalScene = false;
    for (let option of scene.options) {
        if (option.scene == scenes.end) {
            isFinalScene = true;
        }
    }
    if (isFinalScene && sceneFunction !== scenes.loadGame && sceneFunction !== scenes.end) {
        if (sceneFunction !== scenes.todo) {
            // Don't count early access as a "finished" game.
            gameData.statistics.gamesCompleted++;
        }
        if (sceneId) {
            if (gameData.statistics.finalScenes[sceneId] === undefined) {
                gameData.statistics.finalScenes[sceneId] = 1;
            }
            else {
                gameData.statistics.finalScenes[sceneId]++;
            }
        }
        else {
            console.error(`Can't remember final scene, can't get scene id.`);
        }
    }
    if (sceneFunction !== scenes.loadGame) {
        // Save game:
        save(gameData);
    }
    /*if (sceneFunction === scenes.end) {
        function createTable(chart: { options: { data: any; }; }){
        let table = document.createElement("TABLE") as HTMLTableElement;
        let row,header,cell1, cell2;
        let data = chart.options.data;
        table.style.border = "1px solid #000";
        header = table.createTHead();
        row = header.insertRow(0);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell1.style.border = "1px solid #000";
        cell2.style.border = "1px solid #000";
        cell1.innerHTML = "<b>X-Value</b>";
        cell2.innerHTML = "<b>Y-Value</b>";
      
        for(let i = 0; i < data.length; i++){
          for(let j = 0; j< data[i].dataPoints.length; j++){
            row = table.insertRow(1);
            cell1 = row.insertCell(0);
            cell2 = row.insertCell(1);
            cell1.style.border = "1px solid #000";
            cell2.style.border = "1px solid #000";
      
            cell1.innerHTML = data[i].dataPoints[j].x;
            cell2.innerHTML = data[i].dataPoints[j].y;
          }
        }
        document.getElementsByClassName(".side-2 .content .text")[0].appendChild(table);
        }
        }*/
    sceneUniqueId++;
    let currentSceneUniqueId = sceneUniqueId;
    /** Try to click on a certain option. */
    function chooseOption(option) {
        function applyChoice() {
            // Ensure we never press a button that isn't connected to the current scene:
            if (sceneUniqueId !== currentSceneUniqueId)
                return;
            if (sceneFunction === scenes.intro) {
                // Pressed button in intro scene => Made at least one choice:
                gameData.statistics.gamesStarted++;
            }
            gameData.statistics.totalPagesTurned++;
            if (option.sideEffects) {
                option.sideEffects();
            }
            runInBrowser(option.scene);
        }
        // Ensure smooth animations:
        if (flipAnimationInProgress) {
            latestOptionChoice = applyChoice;
        }
        else {
            applyChoice();
        }
    }
    keyboardHandler = (event) => {
        let number = parseInt(event.key);
        if (isNaN(number))
            return;
        // Array is 0 indexed not 1-indexed:
        number--;
        if (number < 0)
            return;
        if (number >= scene.options.length)
            return;
        let option = scene.options[number];
        chooseOption(option);
    };
    let pageNum1 = gameData.pageFlipCount * 2 + 1;
    let pageNum2 = gameData.pageFlipCount * 2 + 2;
    gameData.pageFlipCount++;
    let pages = Array.from(document.querySelectorAll('.page'));
    let previousBackgroundImage = currentBackgroundImage;
    for (let image of Array.from(document.querySelectorAll('#background-images div'))) {
        if (!previousBackgroundImage) {
            // Just fade away the first div when game is started.
            previousBackgroundImage = image;
        }
        // 1. Take unused hidden image div and move it behind / last.
        // 2. Update the hidden div's background-image property.
        // 3. Show the hidden div (after delay so that it has time to be moved behind the current div)
        // 4. Start fading away the current div.
        if (image === previousBackgroundImage) {
            setTimeout(function () {
                image.classList.add('fadeAway');
            }, 30);
        }
        else {
            // Ensure new image div is always after the one that is fading away:
            let backgroundImages = document.getElementById("background-images");
            if (!backgroundImages)
                throw new Error("Can't get background-images");
            backgroundImages.appendChild(image);
            if (scene.backImg) {
                image.setAttribute("style", `background-image: url(${scene.backImg});`);
            }
            else {
                image.removeAttribute("style");
            }
            currentBackgroundImage = image;
            setTimeout(function () {
                image.classList.remove('fadeAway');
            }, 20);
        }
    }
    /** Update the front of a certain page (this is the side of the page with the buttons on). */
    function updateFrontside(page) {
        let side = page.querySelector('.side-1');
        if (!side)
            throw new Error(`Can't get side element`);
        if (sceneId) {
            side.setAttribute('data-scene-id', sceneId);
        }
        let pageNr = page.querySelector('.side-1 .pagenr');
        if (!pageNr)
            throw new Error(`Can't find pageNr element`);
        pageNr.textContent = pageNum2.toString();
        // Mobile friendly text:
        let h2 = page.querySelector('.side-1 .content .pageTitle');
        if (!h2)
            throw new Error('Cant find page title element');
        h2.textContent = scene.title;
        let p = page.querySelector('.side-1 .content .text');
        if (!p)
            throw new Error('Cant find page text element');
        p.textContent = scene.desc;
        let uiButtons = Array.from(page.querySelectorAll("button"));
        for (let button of uiButtons) {
            button.classList.add('unused');
            button.onclick = null;
        }
        for (let i = 0; i < scene.options.length; i++) {
            if (uiButtons.length <= i)
                throw new Error(`Ran out of UI buttons. Need ${scene.options.length} button but only have ${uiButtons.length}.`);
            let uiButton = uiButtons[i];
            let option = scene.options[i];
            uiButton.classList.remove('unused');
            uiButton.textContent = (i + 1).toString() + ". " + option.text;
            uiButton.onclick = function () {
                chooseOption(option);
            };
        }
    }
    function updateBackside(page) {
        let side = page.querySelector('.side-2');
        if (!side)
            throw new Error(`Can't get side element`);
        if (sceneId) {
            side.setAttribute('data-scene-id', sceneId);
        }
        let h2 = page.querySelector('.side-2 .content .pageTitle');
        if (!h2)
            throw new Error('Cant find page title element');
        h2.textContent = scene.title;
        let p = page.querySelector('.side-2 .content .text');
        if (!p)
            throw new Error('Cant find page text element');
        p.textContent = scene.desc;
        let pageNr = page.querySelector('.side-2 .pagenr');
        if (!pageNr)
            throw new Error(`Can't find pageNr element`);
        pageNr.textContent = pageNum1.toString();
    }
    updateBackside(pages[1]);
    updateFrontside(pages[2]);
    /** Update the pages that are visible at the start and after we reset animations. */
    function updateFirstPages() {
        updateBackside(pages[0]);
        updateFrontside(pages[1]);
    }
    if (!firstFlip) {
        flipAnimationInProgress = true;
        window.flipNext();
        // After animation is done:
        setTimeout(function () {
            updateFirstPages();
            resetBookFlip();
            setTimeout(function () {
                flipAnimationInProgress = false;
                if (latestOptionChoice) {
                    latestOptionChoice();
                    latestOptionChoice = null;
                }
            }, 10);
        }, 1000);
    }
    else {
        document.addEventListener('keyup', function (event) {
            if (keyboardHandler) {
                keyboardHandler(event);
            }
        });
        // Don't animate the initial page load:
        updateFirstPages();
        firstFlip = false;
    }
}
/** Reset book animation. This will temporarily disable flipping animations and then ensure that the first page is visible. */
function resetBookFlip() {
    try {
        document.body.classList.add('flipping-back');
        let book = document.getElementsByClassName("book")[0];
        let pages = Array.from(book.querySelectorAll('.page'));
        // Ignore first page:
        pages.shift();
        for (let page of pages) {
            page.classList.remove("flipped");
            page.classList.add("no-anim");
        }
        window.reorder();
    }
    finally {
        setTimeout(function () { document.body.classList.remove('flipping-back'); }, 20);
    }
}
/** Stores all game data that should be saved. */
let gameData = generateGameData();
/** Game data that was saved when page was first loaded. */
let loadedGameData = null;
if ('Deno' in window) {
    let Deno = window.Deno;
    /** Check if a file exists. */
    const exists = async (filename) => {
        try {
            await Deno.stat(filename);
            // successful, file or directory must exist
            return true;
        }
        catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                // file or directory does not exist
                return false;
            }
            else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        }
    };
    // Validate background image urls:
    let checks = [];
    for (let sceneId of Object.keys(scenes)) {
        let sceneFunction = getSceneFunction(sceneId);
        if (!sceneFunction)
            continue;
        let scene = sceneFunction();
        if (scene.backImg) {
            checks.push(exists(scene.backImg).then(function (fileExists) {
                if (!fileExists) {
                    console.log(`--> Missing background image: `, scene.backImg);
                }
                else {
                    console.log(`Checked background image: `, scene.backImg);
                }
            }).catch(function (error) {
                console.error(`Failed to check if the background image "${scene.backImg}" exists:`, error);
            }));
        }
    }
    Promise.all(checks).then(function () {
        // Run game in terminal:
        runInDeno(scenes.intro);
    });
}
else {
    // Duplicate book pages:
    let book = document.getElementsByClassName("book")[0];
    for (let page of Array.from(book.querySelectorAll('.page'))) {
        book.appendChild(page.cloneNode(true));
        book.appendChild(page.cloneNode(true));
    }
    resetBookFlip();
    // Load game data:
    loadedGameData = load();
    if (loadedGameData) {
        // Always load stats:
        gameData.statistics = loadedGameData.statistics;
    }
    runInBrowser(scenes.loadGame);
}
