interface Scene {
    title: string,
    desc: string,
    options: Option[],
    backImg?: string,
}
interface Option {
    /** Description for this choice. */
    text: string,
    /** The scene that should be switched to if this option is chosen. */
    scene: () => Scene,
    /** Option will only be shown if this is true, or if it isn't specified at all. */
    enabled?: boolean,
    /** Code to run if this option is chosen. */
    sideEffects?: () => any,
}

let inventoryItems = {
    timeArtifact: false,
    invisibilityCloak: false,
};
type InventoyItem = keyof typeof inventoryItems;

function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

let inventory = {
    add: function (item: InventoyItem) {
        inventoryItems[item] = true;
    },
    contains: function (item: InventoyItem): boolean {
        return inventoryItems[item];
    },
    remove: function (item: InventoyItem) {
        inventoryItems[item] = false;
    },
    toSaveData: function (): Object {
        return inventoryItems;
    },
    fromSaveData: function (data: Object) {
        inventoryItems = deepCopy(data) as any;
    },
};
let defaultInventoryData = deepCopy(inventory.toSaveData());

let loadedSceneFunction: any = null;

let scenes = {
    loadGame: function (): Scene {
        let options: Option[] = [
            {
                text: `New Game`,
                scene: scenes.intro,
            },
        ];
        if (loadedSceneFunction) {
            options.push({
                text: `Load Game`,
                scene: loadedSceneFunction,
                sideEffects: function () {
                    restoreStateFromSaveData(load() as any);
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
    intro: function (): Scene {
        return {
            title: 'Introduction',
            desc: `You’re a wizard in a group of adventures undertaking quests. When you awake in your inn one day, after a particularly gruelling quest, you find a letter claiming to be written by yourself even though you have no memory of writing such a thing. In the letter there is a strange artifact that can allegedly bring anyone who activates it back in time. The letter claims that you must go and retrieve the same artifact from where it was originally stored and then travel back in time to put together this letter in order for the space-time continuum to remain stable.`,
            options: [
                {
                    text: "Nonsense! You don’t believe in any of this! You should investigate if this artifact even does anything at all.",
                    scene: scenes.avoidScam,
                    sideEffects: function() {
                        inventory.add("timeArtifact")
                    }
                },
                {
                    text: "This sounds pretty serious! You should bring this letter and the artifact to your companions and see if they have any insights.",
                    scene: scenes.companions,
                    sideEffects: function() {
                        inventory.add("timeArtifact")
                    }
                }
            ],
            backImg: "./img/inn.png",
        };
    },

    companions: function (): Scene {
        return {
            title: `Companions`,
            desc: `Entering the bar in which the companions of yours reside, you hastily gather your party to announce the conspicuous quest. Given your history of embarking on many dangerous quests in this company before, it comes as no surprise that they’re willing to undertake this one right away. The letter addresses the location of the sought artifact, a great castle in the woods not too far from where you currently are, so that’s where you along with your companions will be heading next.`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.castleEntry,
                }
            ],
            backImg: "./img/houseNight.png",
        }
    },

    avoidScam: function (): Scene {
        return {
            title: `Avoiding scams`,
            desc: `As you begin trying to interact with the artifact, running your fingers along the clock-like design, you quickly notice the room darkening and you can see the night sky through a window. Unless this is a powerful illusion then this artifact seems to have actually turned back time. So it wasn't really a trick, was it? Confounded with having your only reasonable expectations broken, you decide to:`,
            options: [
                {
                    text: "Take this quest alone.",
                    scene: scenes.castleEntry,
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
            backImg: "./img/inn.png",
        };
    },

    endingPhantomTrick: function (): Scene {
        return {
            title: `Ending - The phantom trick`,
            desc: `Convinced the quest is a treacherous waste of time, you move on, business as usual. Some time shortly thereafter, you’re approached by a cloaked figure, it turns dark and you feel no more.`,
            options: [
                {
                    text: "The end",
                    scene: scenes.end,
                }
            ],
            backImg: "./img/villageNight.png",
        }
    },

    castleEntry: function (): Scene {
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
                    scene: randomDungeonsScene,
                },
                {
                    text: "Listen for signs of danger.",
                    scene: scenes.entryInspection,
                }
            ],
            backImg: "./img/castleDay.png",
        }
    },

    frontGate: function (): Scene {
        return {
            title: 'Infiltrating the castle - Front gate',
            desc: `Determined to enter this place head on, your firm warrior Leroy charges ahead into the main hallway with a fierce battle cry!
            With any sense of suddulty gone, you've catched the attention of a dragon, leaving you with no choice but to:`,
            options: [
                {
                    text: "Engage the dragon in combat.",
                    scene: scenes.avoidScam,
                },
                {
                    text: "Perform a tactical retreat.",
                    scene: scenes.companions,
                }
            ],
            backImg: "./img/frontgate.png",
        };
    },

    dragonRetreat: function (): Scene {
        return {
            title: 'Infiltrating the castle - Front gate',
            desc: `Determined to enter this place head on, your firm warrior Leroy charges ahead into the main hallway with a fierce battle cry!
            With any sense of suddulty gone, you've catched the attention of a dragon, leaving you with no choice but to:`,
            options: [
                {
                    text: "Engage the dragon in combat.",
                    scene: scenes.avoidScam,
                },
                {
                    text: "Perform a tactical retreat.",
                    scene: scenes.companions,
                }
            ],
            backImg: "./img/frontgate.png",
        };
    },

    dragonBattle: function (): Scene {
        return {
            title: 'Infiltrating the castle - Front gate',
            desc: `Determined to enter this place head on, your firm warrior Leroy charges ahead into the main hallway with a fierce battle cry!
            With any sense of suddulty gone, you've catched the attention of a dragon, leaving you with no choice but to:`,
            options: [
                {
                    text: "Engage the dragon in combat.",
                    scene: scenes.avoidScam,
                },
                {
                    text: "Perform a tactical retreat.",
                    scene: scenes.companions,
                }
            ],
            backImg: "./img/frontgate.png",
        };
    },

    dungeonsDesolate: function (): Scene {
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

    dungeonsSpiders: function (): Scene {
        return {
            title: 'Infiltrating the castle - Dungeons',
            desc: `Committing to what appears to be a stealthier route, you go downwards towards the dimly lit and seemingly desolate dungeons. Your treversal here quickly uncovers a threat as a horde of large spiders and other similarly toxic insects ambushes you from all sides.`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/dungeon.png",
        };
    },

    entryInspection: function (): Scene {
        let randomDungeonsInspection: string
        if (randomDungeonsScene === scenes.dungeonsDesolate) {
            randomDungeonsInspection = ' The dungeons quietly sound with dripping liquids.'
        } else {
            randomDungeonsInspection = ' The dungeons echo with many light footsteps in bursts.'
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
                    scene: randomDungeonsScene,
                }
            ],
            backImg: "./img/castleDay.png",
        };
    },

    stairs: function (): Scene {
        return {
            title: `Infiltrating the castle - Stairs`,
            desc: `Having now exited the dungeons, you stand before a set of stairs leading to three different floors. Potential points of interest on these floors are respectively a kitchen, a library and a hallway with many smaller rooms.`,
            options: [
                {
                    text: "Explore first floor.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Explore second floor.",
                    scene: scenes.library,
                },
                {
                    text: "Explore third floor.",
                    scene: scenes.entryInspection,
                }
            ],
            backImg: "./img/staircase2.png",
        }
    },

    kitchen: function (): Scene {
        return {
            title: 'Infiltrating the castle - Kitchen',
            desc: ``,
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

    library: function (): Scene {
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

    libraryClues: function (): Scene {
        return {
            title: 'Infiltrating the castle - Library - Clues',
            desc: `After having traversed the stil environment in a search for the right texts on their corresponding shelves, you attain a book titled “The Unique Entities of Castle Alzheim”, which details the nature of various items confined here including a time artifact. The time artifact is described as a warped matter capable of altering four-dimensional past timelines provided they’re justified in parallel formation and within its range of 24 hours which can’t be offseted. This power originates from another secretive art called “Portus” which unlike the time artifact also brings one back in space for better or worse. 
            
            Just as you’re about to leave, a ragged crooked-looking humanoid creature enters the room, instantly beginning to conjure up a horde of undead summonings upon noticing your presence. Countering this you:`,
            options: [
                {
                    text: "Charge the main foe",
                    scene: scenes.frontGate,
                },
                {
                    text: "Fend off the summonings.",
                    scene: scenes.stairs,
                },
                {
                    text: "Use time artifact.",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/library.png",
        };
    },

    libraryPast: function (): Scene {
        return {
            title: 'Infiltrating the castle - Library - Clues',
            desc: `After having traversed the stil environment in a search for the right texts on their corresponding shelves, you attain a book titled “The Unique Entities of Castle Alzheim”, which details the nature of various items confined here including a time artifact. The time artifact is described as a warped matter capable of altering four-dimensional past timelines provided they’re justified in parallel formation and within its range of 24 hours which can’t be offseted. This power originates from another secretive art called “Portus” which unlike the time artifact also brings one back in space for better or worse. 
            
            Just as you’re about to leave, a ragged crooked-looking humanoid creature enters the room, instantly beginning to conjure up a horde of undead summonings upon noticing your presence. Countering this you:`,
            options: [
                {
                    text: "Charge the main foe",
                    scene: scenes.frontGate,
                },
                {
                    text: "Fend off the summonings.",
                    scene: scenes.stairs,
                },
                {
                    text: "Use time artifact.",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/library.png",
        };
    },

    throneRoom: function (): Scene {
        return {
            title: 'Infiltrating the castle - Throne room',
            desc: `Infiltrating the castle - throne room:
            The center of attention here is a locked chest upon a pedestal, you figure that to unlock the contraption some kind of puzzle must be solved. Observing your immediate surroundings with this in mind, you notice a pressure plate in the floor which only when held pressed opens a wall into an indented area including two levers. Cooperating with your companions this task seems easy enough, you stand on the pressure plate while.`,
            options: [
                {
                    text: "Charge the main foe",
                    scene: scenes.frontGate,
                },
                {
                    text: "Fend off the summonings.",
                    scene: scenes.stairs,
                },
            ],
            backImg: "./img/library.png",
        };
    },

    artifactChamber: function (): Scene {
        function getRandomResult(index: number): () => Scene {
            if (index === randomPasswordIndex) {
                return scenes.timeArtifact
            } else {
                return scenes.artifactChamberRejection
            }
        }
        let options: Option[] = [
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
            },
            {
                text: "Turn away from the gate to search elsewhere.",
                scene: scenes.stairs,
            },
        ]
        return {
            title: `Infiltrating the castle - artifact chamber`,
            desc: `You come before a gate demanding a password for access to its contents. Many words and phrases that you’ve picked up from observations throughout the castle crosses your mind, but you are hesitant to propose any incorrect password given the risk of disallowance to pass should you lack information or misinterpret the key to this lock more than once. You:`,
            options,
            backImg: "./img/gate.jpg",
        }
    },

    artifactChamberKnocking: function (): Scene {
        function getRandomResult(index: number): () => Scene {
            if (index === randomPasswordIndex) {
                return scenes.timeArtifact
            } else {
                return scenes.artifactChamberRejection
            }
        }
        let options: Option[] = [
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
                text: "Turn away from the gate to search elsewhere.",
                scene: scenes.stairs,
            },
        ];
        // Remember the option that we click on:
        for (let i = 0; i < 5; i++) {
            options[i].sideEffects = function () {
                // Exploit inventory to save data:
                (inventoryItems as any).guessedPassword = i;
            };
        }
        return {
            title: `Infiltrating the castle - artifact chamber - Go knocking`,
            desc: `You knock on the gate, but nothing happens. You knock again and this time with all your might as hard as you can, but alas, it’s to no effect...Reconsidering everything, you:`,
            options,
            backImg: "./img/gate.jpg",
        }
    },

    artifactChamberRejection: function (): Scene {
        function getRandomResult(index: number): () => Scene {
            if (index === randomPasswordIndex) {
                return scenes.timeArtifact
            } else {
                return scenes.artifactChamberRejection
            }
        }
        let options: Option[] = [
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
            },
            {
                text: "Turn away from the gate to search elsewhere.",
                scene: scenes.stairs,
            },
        ];
        // Remove the option that was used in the previous scene:
        options.splice((inventoryItems as any).guessedPassword, 1);
        return {
            title: `Infiltrating the castle - Artifact chamber - Access denied`,
            desc: `The door reacts disapprovingly, keeping itself shut while whispering “Access denied!”. Considering a final attempt to unlock this gate, you:`,
            options,
        }
    },

    timeArtifact: function (): Scene {
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

    gotThrough: function (): Scene {
        return {
            title: 'Got through',
            desc: `Now having reached the final step of this quest, you prepare an envelope, writing down the same text as in the received letter from the start but also stopping to ponder for a moment on what you’d really prefer to do here, finally going through with:`,
            options: [
                {
                    text: "Putting the stolen artifact in the letter.",
                    scene: scenes.endingNofunnyIdeas,
                },
                {
                    text: "Putting the artifact from the letter in the letter.",
                    scene: scenes.keepStolenArtifact,
                }
            ],
            backImg: "./img/houseNight.png"
        };
    },

    endingNofunnyIdeas: function (): Scene {
        return {
            title: 'Ending - Don’t get any funny ideas',
            desc: `You just take the letter with the requested artifact and put it back next to the bed that your past self is sleeping in. Feeling relieved to finally have put things back in order you, as well as your companions, leave the village to find new opportunities elsewhere. A couple of days later you can’t find the second time artifact anymore and you assume it has vanished into the time loop it came from. You aren’t disappointed, instead you are relieved to never again have to care about such random absurdities ever again. You are sure nothing bad could possibly come from not investigating these strange events and that no consequences will be had from this adventure.`,
            options: [
                {
                    text: "The end",
                    scene: scenes.end,
                }
            ],
            backImg: "./img/inn.png"
        };
    },

    keepStolenArtifact: function (): Scene {
        return {
            title: 'Ending - Keep the stolen artifact for yourself',
            desc: `You put your original time artifact, the one you got in the letter, back inside the letter and put it next to the bed that your past self is sleeping in. Feeling quite clever and hoping to keep your newly stolen artifact, you and your companions leave the village to find out what shenanigans you can get up to with this newly acquired power. You are sure the time loop will solve itself now that it, at least, has one time artifact.
            
            In the middle of the following night a pair of strangers approach you. They claim to be from the time-correction beuro and that you will perish unless you give up your time artifact. They assure you that if you give them the artifact then they can solve the time loop and ensure your safety.`,
            options: [
                {
                    text: "You know a scam when you see one. No way will you be surrendering your hard earned time artifact to these morons!",
                    scene: scenes.endingNofunnyIdeas,
                },
                {
                    text: "Perhaps it was naive to think that you would get out of this mess with something for it. Just give them the artifact and wash your hands from all of this trouble.",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/villageNight.png"
        };
    },

    noTrouble: function (): Scene {
        return {
            title: 'Ending - No looking for trouble',
            desc: `Giving these strangers the time artifact as requested, they quickly leave and the troublesome situation seems to be fully resolved as expected. You go home.`,
            options: [
                {
                    text: "The end",
                    scene: scenes.loadGame,
                }
            ],
            backImg: "./img/inn.png"
        };
    },

    artifactBargin: function (): Scene {
        return {
            title: 'Ending - Keep the stolen artifact for yourself - Refuse strangers',
            desc: `They seem surprised at your stubborn rejection of their “help” and they call you greedy. They argue among themselves for a couple of minutes and then approach you again. They have decided to appeal towards your greed and offer you a sizable amount of gold if you just give them the time artifact.`,
            options: [
                {
                    text: "Now this is more like it! A deal worth taking! You were tired of this nonsense anyway, and now you get paid to get rid of it!? You certainly are good at making deals. These second rate scam artists have nothing on you.",
                    scene: scenes.endingNofunnyIdeas,
                },
                {
                    text: "If they are prepared to pay that much for it so soon then it must certainly be worth a lot more. You don’t become rich by being a fool and you know when there is money to be had. Demand even more gold!",
                    scene: scenes.artifactBlackmail,
                },
                {
                    text: "Do they take you for an idiot? Obviously you can make a near limitless amount of gold by just using the time artifact yourself. There is no way you will agree to give it away!",
                    scene: scenes.stairs,
                }
            ],
            backImg: "./img/villageNight.png"
        };
    },

    artifactGreedNeed: function (): Scene {
        return {
            title: 'Ending - Give the stolen artifact to the strangers claiming to be from the time-correction beuro for a hefty immediate financial boost - Greed',
            desc: `Pleased to strike a resolving deal, you exchange the time artifact for the promised sizable amount of gold. The cloaked strangers thank you for your cooperation and then disappear far from sight along with the time artifact. And so that was the end of that. You may or may not be happy, but more importantly, you are rich.`,
            options: [
                {
                    text: "The end",
                    scene: scenes.loadGame,
                }
            ],
            backImg: "./img/villageNight.png"
        };
    },

    artifactBlackmail: function (): Scene {
        return {
            title: 'Ending - Keep the stolen artifact for yourself - Clever blackmail',
            desc: `Countering their offer with your demand to be paid at no hidden discount, they begrudgingly agree to a price sum double that of their initial proposal but still less than the quadruple increase you demanded.`,
            options: [
                {
                    text: "You won’t surrender to any half-baked macro-transaction, you only sell a possession such as this at full price.",
                    scene: scenes.endingNofunnyIdeas,
                },
                {
                    text: "That will do, let’s make the deal.",
                    scene: scenes.stairs,
                },
            ],
            backImg: "./img/villageNight.png"
        };
    },

    end: function (): Scene {
        return{
            title: 'The End',
            desc: 'Insert titles of last scenes',
            options: [
                {
                    text: "Return to main menu",
                    scene: scenes.loadGame,
                }

            ],
            backImg: "./img/mainBg.jpg"
        }
    }
};

/** Get a scene's id as a string. */
function getSceneId(sceneFunction: () => Scene): string | null {
    for (let id of Object.keys(scenes)) {
        if ((scenes as any)[id] === sceneFunction) {
            return id;
        }
    }
    return null;
}
function getSceneFunction(sceneId: string): null | (() => Scene) {
    let sceneFunction = (scenes as any)[sceneId];
    if (sceneFunction) return sceneFunction;
    else return null;
}



/** Run the game inside a terminal for some debugging. */
function runInDeno(sceneFunction: () => Scene) {
    while (true) {
        let scene = sceneFunction();
        scene.options = scene.options.filter(function (option) {
            if (option.enabled === undefined) return true;
            return option.enabled;
        });

        console.log('   ' + scene.title);
        console.log();
        console.log(scene.desc);
        console.log();
        if (scene.options.length === 1) {
            console.log('Option:')
        }
        else {
            console.log('Options:')
        }
        for (let i = 0; i < scene.options.length; i++) {
            console.log(`${i + 1}. ${scene.options[i].text}`)
        }
        let inputText = prompt("");
        if (inputText === null) continue;

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
        if (inputNumber === null || isNaN(inputNumber)) continue;
        inputNumber--;
        if (inputNumber < 0) continue;
        if (inputNumber >= scene.options.length) continue;

        console.log(`You selected option: `, inputNumber)

        let selectedOption = scene.options[inputNumber];
        if (selectedOption.sideEffects) {
            selectedOption.sideEffects();
        }
        sceneFunction = selectedOption.scene;
    }
}



/** Get a random element in an array. */
function chooseRandomElement<T>(array: T[]): T {
    if (array.length === 0) {
        throw new Error('Array must contain at least 1 element');
    }
    return array[Math.floor(Math.random() * array.length)]
}

let randomDungeonsScene: () => Scene;
let randomPasswordIndex = 0;



interface SaveData {
    sceneId: string,
    inventory: Object,
    pageFlipCount: number,
    randomPasswordIndex: number,
    randomDungenonsScene: string,
}
function save(data: SaveData) {
    try {
        localStorage.setItem('saveData', JSON.stringify(data));
    } catch (error) {
        console.log("Can't save data: ", error);
    }
}
function load(): SaveData | null {
    try {
        let loaded = localStorage.getItem('saveData');
        if (loaded) {
            return JSON.parse(loaded);
        } else {
            return null;
        }
    } catch (error) {
        console.error("Can't load save data: ", error);
        return null;
    }
}
function restoreStateFromSaveData(data: SaveData) {
    inventory.fromSaveData(data.inventory);

    pageFlipCount = data.pageFlipCount;
    if (isNaN(pageFlipCount)) {
        pageFlipCount = 1;
    }
    randomPasswordIndex = data.randomPasswordIndex;

    let sceneFunction = getSceneFunction(data.randomDungenonsScene);
    if (!sceneFunction) throw new Error(`Can't load save data`);
    randomDungeonsScene = sceneFunction;
}


/** Just true when first starting the game. */
let firstFlip = true;
/** A number that is unique to the current scene, ensures options are always related to the current scene. */
let sceneUniqueId = 0;
/** Used to update page numbers. */
let pageFlipCount = 0;
/** If true then we are currently animating the book, do not allow another option to be selected yet. */
let flipAnimationInProgress = false;
/** The user made a choice while animation was playing, apply as soon as possible. */
let latestOptionChoice: (() => any) | null = null;
/** The div tag that contains the current scene's background image. */
let currentBackgroundImage: Element | null = null;
/** Make a choice based on a keyboard event. */
let keyboardHandler: ((event: KeyboardEvent) => any) | null = null;
function runInBrowser(sceneFunction: () => Scene) {
    latestOptionChoice = null;

    if (sceneFunction === scenes.intro) {
        // New Game setup:
        randomPasswordIndex = Math.floor(Math.random() * 5);
        randomDungeonsScene = chooseRandomElement([scenes.dungeonsDesolate, scenes.dungeonsSpiders]);
    }

    let sceneId = getSceneId(sceneFunction);
    if (sceneFunction !== scenes.loadGame) {
        // Save game:
        if (sceneId) {
            let randomDungeonsSceneId = getSceneId(randomDungeonsScene);
            if (!randomDungeonsSceneId) throw new Error('Failed to save randomDungenonsScene');
            save({
                sceneId: sceneId,
                inventory: inventory.toSaveData(),
                pageFlipCount,
                randomPasswordIndex,
                randomDungenonsScene: randomDungeonsSceneId,
            });
        } else {
            console.error(`Failed to find scene id for current scene, can't save data.`);
        }
    }



    let scene = sceneFunction();
    scene.options = scene.options.filter(function (option) {
        if (option.enabled === undefined) return true;
        else return option.enabled;
    });

    /** Try to click on a certain option. */
    function chooseOption(option: Option) {
        function applyChoise() {
            // Ensure we never press a button that isn't connected to the current scene:
            if (sceneUniqueId !== currentSceneUniqueId) return;
            if (option.sideEffects) {
                option.sideEffects();
            }
            runInBrowser(option.scene);
        }
        // Ensure smooth animations:
        if (flipAnimationInProgress) {
            latestOptionChoice = applyChoise;
        } else {
            applyChoise();
        }
    }
    keyboardHandler = (event) => {
        let number = parseInt(event.key);
        if (isNaN(number)) return;
        // Array is 0 indexed not 1-indexed:
        number--;
        if (number < 0) return;
        if (number >= scene.options.length) return;

        let option = scene.options[number];
        chooseOption(option);
    };

    sceneUniqueId++;
    let currentSceneUniqueId = sceneUniqueId;

    let pageNum1 = pageFlipCount * 2 + 1;
    let pageNum2 = pageFlipCount * 2 + 2;
    pageFlipCount++;

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
            setTimeout(function() {
                image.classList.add('fadeAway');
            }, 30);
        } else {
            // Ensure new image div is always after the one that is fading away:
            let backgroundImages = document.getElementById("background-images");
            if (!backgroundImages) throw new Error("Can't get background-images");
            backgroundImages.appendChild(image);

            if (scene.backImg) {
                image.setAttribute("style", `background-image: url(${scene.backImg});`);
            } else {
                image.removeAttribute("style");
            }

            currentBackgroundImage = image;
            setTimeout(function() {
                image.classList.remove('fadeAway');
            }, 20);
        }
    }


    /** Update the front of a certain page (this is the side of the page with the buttons on). */
    function updateFrontside(page: Element) {
        let side = page.querySelector('.side-1');
        if (!side) throw new Error(`Can't get side element`);
        if (sceneId) {
            side.setAttribute('data-scene-id', sceneId);
        }

        let pageNr = page.querySelector('.side-1 .pagenr');
        if (!pageNr) throw new Error(`Can't find pageNr element`);
        pageNr.textContent = pageNum2.toString();


        // Mobile friendly text:
        let h2 = page.querySelector('.side-1 .content .pageTitle');
        if (!h2) throw new Error('Cant find page title element');
        h2.textContent = scene.title;

        let p = page.querySelector('.side-1 .content .text');
        if (!p) throw new Error('Cant find page text element');
        p.textContent = scene.desc;


        let uiButtons = Array.from(page.querySelectorAll("button"));
        for (let button of uiButtons) {
            button.classList.add('unused');
            button.onclick = null;
        }
        for (let i = 0; i < scene.options.length; i++) {
            if (uiButtons.length <= i) throw new Error('Ran out of UI buttons.')
            let uiButton = uiButtons[i];
            let option = scene.options[i];

            uiButton.classList.remove('unused');
            uiButton.textContent = (i + 1).toString() + ". " + option.text;
            uiButton.onclick = function () {
                chooseOption(option);
            };
        }
    }
    function updateBackside(page: Element) {
        let side = page.querySelector('.side-2');
        if (!side) throw new Error(`Can't get side element`);
        if (sceneId) {
            side.setAttribute('data-scene-id', sceneId);
        }

        let h2 = page.querySelector('.side-2 .content .pageTitle');
        if (!h2) throw new Error('Cant find page title element');
        h2.textContent = scene.title;

        let p = page.querySelector('.side-2 .content .text');
        if (!p) throw new Error('Cant find page text element');
        p.textContent = scene.desc;

        let pageNr = page.querySelector('.side-2 .pagenr');
        if (!pageNr) throw new Error(`Can't find pageNr element`);
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
        (window as any).flipNext();

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
    } else {
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
        (window as any).reorder();
    } finally {
        setTimeout(function () { document.body.classList.remove('flipping-back'); }, 20);
    }
}
if ('Deno' in window) {
    let Deno = (window as any).Deno;
    const exists = async (filename: string): Promise<boolean> => {
        try {
            await Deno.stat(filename);
            // successful, file or directory must exist
            return true;
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                // file or directory does not exist
                return false;
            } else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        }
    };

    let checks = [];
    for (let sceneId of Object.keys(scenes)) {
        let sceneFunction = getSceneFunction(sceneId);
        if (!sceneFunction) continue;
        let scene = sceneFunction();
        if (scene.backImg) {
            checks.push(exists(scene.backImg).then(function(fileExists) {
                if (!fileExists) {
                    console.log(`--> Missing background image: `, scene.backImg);
                } else {
                    console.log(`Checked background image: `, scene.backImg);
                }
            }).catch(function(error) {
                console.error(`Failed to check if the background image "${scene.backImg}" exists:`, error);
            }));
        }
    }

    Promise.all(checks).catch(function() {
        return null;
    }).then(function() {
        runInDeno(scenes.intro)
    });
} else {
    // Duplicate book pages:
    let book = document.getElementsByClassName("book")[0];
    for (let page of Array.from(book.querySelectorAll('.page'))) {
        book.appendChild(page.cloneNode(true));
        book.appendChild(page.cloneNode(true));
    }
    resetBookFlip();

    let firstScene = scenes.intro;
    let loadedSceneData = load();
    if (loadedSceneData) {
        let sceneFunction = getSceneFunction(loadedSceneData.sceneId);
        if (sceneFunction) {
            loadedSceneFunction = sceneFunction;
            firstScene = scenes.loadGame;
        } else {
            console.error(`Failed to load save data, couldn't find scene with id "${loadedSceneData.sceneId}".`);
        }
    }
    runInBrowser(firstScene)
}