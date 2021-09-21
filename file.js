var inventory = {
    add: function (item) {
    }
};
var randomScene = ['dungeonsDesolate', 'DungeonsSpiders'];
var scenes = {
    intro: function () {
        return {
            title: 'Introduction',
            desc: "You're a wizard in a group of adventures undertaking quests. When you awake in your inn one day, after a particularly gruelling quest, you find a letter claiming to be written by yourself even though you have no memory of writing such a thing. In the letter there is a strange artifact that can allegedly bring anyone who activates it back in time. The letter claims that you must go and retrieve the same artifact from where it was originally stored and then travel back in time to put together this letter in order for the space-time continuum to remain stable.",
            options: [
                {
                    text: "Nonsense! You don’t believe in any of this! You should investigate if this artifact even does anything at all.",
                    scene: scenes.avoidScam,
                    sideEffects: function () {
                        inventory.add("Test item");
                    }
                },
                {
                    text: "This sounds pretty serious! You should bring this letter and the artifact to your companions and see if they have any insights.",
                    scene: scenes.companions,
                }
            ]
        };
    },
    companions: function () {
        return {
            title: "Companions",
            desc: "Entering the bar in which the companions of yours reside, you hastily gather your party to announce the conspicuous quest. Given your history of embarking on many dangerous quests in this company before, it comes as no surprise that they\u2019re willing to undertake this one right away. The letter addresses the location of the sought artifact, a great castle in the woods not too far from where you currently are, so that\u2019s where you along with your companions will be heading next.",
            options: [
                {
                    text: "Continue",
                    scene: scenes.CastleEntry,
                }
            ],
        };
    },
    avoidScam: function () {
        return {
            title: "Avoiding scams",
            desc: "As you begin trying to interact with the artifact, running your fingers along the clock-like design, you quickly notice the room darkening and you can see the night sky through a window. Unless this is a powerful illusion then this artifact seems to have actually turned back time. So it wasn't really a trick, was it? Confounded with having your only reasonable expectations broken, you decide to:",
            options: [
                {
                    text: "Take this quest alone.",
                    scene: scenes.CastleEntry,
                },
                {
                    text: "Involve your companions on this suspiciously potential scam to an intriguing quest by consulting them about it anyway.",
                    scene: scenes.companions,
                },
                {
                    text: "Turn down this quest entirely.",
                    scene: scenes.endingPhantomTrick,
                }
            ],
        };
    },
    endingPhantomTrick: function () {
        return {
            title: "Ending - The phantom trick",
            desc: "Convinced the quest is a treacherous waste of time, you move on, business as usual. Some time shortly thereafter, you\u2019re approached by a cloaked figure, it turns dark and you feel no more.",
            options: [
                {
                    text: "Game over",
                    scene: scenes.intro,
                }
            ],
        };
    },
    CastleEntry: function () {
        return {
            title: "Infiltrating the castle - Entry",
            desc: "Once at the site, you notice two distinct ways of entering the castle. The front gate stands open but ominous shadows surround it, is there someone there? The dungeons is the other entrance, located in the midst of ruins nearby the castle, perhaps it can give you as well as anything else a stronger cover.",
            options: [
                {
                    text: "Enter front gate.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Enter dungeons.",
                    scene: scenes.dungeonsDesolate
                },
                {
                    text: "Listen for signs of danger.",
                    scene: scenes.entryInspection,
                }
            ],
        };
    },
    frontGate: function () {
        return {
            title: 'Infiltrating the castle - Front gate',
            desc: "Determined to enter this place head on, your firm warrior Leroy charges ahead into the main hallway with a fierce battle cry!\n            With any sense of suddulty gone, you've catched the attention of a dragon, leaving you with no choice but to:",
            options: [
                {
                    text: "Engage the dragon in combat.",
                    scene: scenes.avoidScam,
                },
                {
                    text: "Perform a tactical retreat.",
                    scene: scenes.companions,
                }
            ]
        };
    },
    dungeonsDesolate: function () {
        return {
            title: 'Infiltrating the castle - Dungeons',
            desc: "Committing to what appears to be a stealthier route, you go downwards towards the dimly lit and seemingly desolate dungeons. The treversal goes smoothly and you spot something different. Engravings on a wall, depicting an odd object on a throne in a rather vague frame. Regardless of what direction may be optimal at one point or another, you proceed to walk the only path before you now that doesn\u2019t turn away from the castle\u2019s chambers.",
            options: [
                {
                    text: "Continue",
                    scene: scenes.stairs,
                }
            ]
        };
    },
    dungeonsSpiders: function () {
        return {
            title: 'Infiltrating the castle - Dungeons',
            desc: "Committing to what appears to be a stealthier route, you go downwards towards the dimly lit and seemingly desolate dungeons. The treversal goes smoothly and you spot something different. Engravings on a wall, depicting an odd object on a throne in a rather vague frame. Regardless of what direction may be optimal at one point or another, you proceed to walk the only path before you now that doesn\u2019t turn away from the castle\u2019s chambers.",
            options: [
                {
                    text: "Continue",
                    scene: scenes.stairs,
                }
            ]
        };
    },
    entryInspection: function () {
        return {
            title: 'Infiltrating the castle - Inspection of entry',
            desc: "Taking the time not to run in blind, you listen very closely for any signs of what\u2019s happening in there. You hear the sound of a faint breath and sense heat in irregular waves from the front gate. The dungeons echo with many light footsteps in bursts.",
            options: [
                {
                    text: "Enter front gate.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Enter dungeons.",
                    scene: scenes.dungeonsDesolate,
                }
            ]
        };
    },
    stairs: function () {
        return {
            title: "Infiltrating the castle - Stairs",
            desc: "Having now exited the dungeons, you stand before a set of stairs leading to three different floors. Potential points of interest on these floors are respectively a kitchen, a library and a hallway with many smaller rooms.",
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
        };
    },
    library: function () {
        return {
            title: 'Infiltrating the castle - Library',
            desc: "This chamber is filled with books in vast shelves. You suspect clues about the whereabouts of the artifact you\u2019re looking for could be encountered among the historic section which should list what more unique items are stored here. Contemplating whether or not to go for whatever contents and risks that may be found here, you choose to proceed with:",
            options: [
                {
                    text: "Going through the library.",
                    scene: scenes.libraryClues,
                },
                {
                    text: "Turning away to find another room.",
                    scene: scenes.stairs,
                }
            ]
        };
    },
    libraryClues: function () {
        return {
            title: 'Infiltrating the castle - Library - Clues',
            desc: "After having traversed the stil environment in a search for the right texts on their corresponding shelves, you attain a book titled \u201CThe Unique Entities of Castle Alzheim\u201D, which details the nature of various items confined here including a time artifact. The time artifact is described as a warped matter capable of altering four-dimensional past timelines provided they\u2019re justified in parallel formation and within its range of 24 hours which can\u2019t be offseted. This power originates from another secretive art called \u201CPortus\u201D which unlike the time artifact also brings one back in space for better or worse.",
            options: [
                {
                    text: "Going through the library.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Turning away to find another room.",
                    scene: scenes.dungeonsDesolate,
                }
            ]
        };
    },
    artifactChamber: function () {
        return {
            title: "Infiltrating the castle - artifact chamber",
            desc: "You come before a gate demanding a password for access to its contents. Many words and phrases that you\u2019ve picked up from observations throughout the castle crosses your mind, but you are hesitant to propose any incorrect password given the risk of disallowance to pass should you lack information or misinterpret the key to this lock more than once. It won\u2019t budge through manipulation of space or time either, the heavy gate\u2019s security spell is immune against the art of time travel familiar to it. You:",
            options: [
                {
                    text: "Speak the password “Warped matter”.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Speak the password “More time to stop the key from turning”",
                    scene: scenes.frontGate,
                },
                {
                    text: "Speak the password “Justify the four-dimensional branches”",
                    scene: scenes.frontGate,
                },
                {
                    text: "Speak the password “Portus”.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Speak the password “Second parallel timeline”",
                    scene: scenes.frontGate,
                },
                {
                    text: "Password? Just knock on the gate.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Turn away from the gate to search elsewhere.",
                    scene: scenes.frontGate,
                },
            ],
        };
    },
    artifactChamberKnocking: function () {
        return {
            title: "Infiltrating the castle - artifact chamber - Go knocking",
            desc: "You knock on the gate, but nothing happens. You knock again and this time with all your might as hard as you can, but alas, it\u2019s to no effect...Reconsidering everything, you:",
            options: [
                {
                    text: "Speak the password “Warped matter”.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Speak the password “More time to stop the key from turning”",
                    scene: scenes.frontGate,
                },
                {
                    text: "Speak the password “Justify the four-dimensional branches”",
                    scene: scenes.frontGate,
                },
                {
                    text: "Speak the password “Portus”.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Speak the password “Second parallel timeline”",
                    scene: scenes.frontGate,
                },
                {
                    text: "Turn away from the gate to search elsewhere.",
                    scene: scenes.frontGate,
                },
            ],
        };
    },
};
function getSceneId(sceneFunction) {
    for (var _i = 0, _a = Object.keys(scenes); _i < _a.length; _i++) {
        var id = _a[_i];
        if (scenes[id] === sceneFunction) {
            return id;
        }
    }
    return null;
}
function run(sceneFunction) {
    while (true) {
        var scene = sceneFunction();
        console.log('   ' + scene.title);
        console.log();
        console.log(scene.desc);
        console.log();
        console.log('Options:');
        for (var i = 0; i < scene.options.length; i++) {
            console.log(i + 1 + ". " + scene.options[i].text);
        }
        if (scene.options.length === 1) {
            console.log('Option:');
        }
        var inputText = prompt("");
        if (inputText === null)
            continue;
        if (inputText.startsWith("skip to ")) {
            var level = inputText.slice("skip to ".length);
            console.log(level);
            var wantedScene = scenes[level];
            if (wantedScene === undefined) {
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
        var inputNumber = parseInt(inputText);
        if (inputNumber === null || isNaN(inputNumber))
            continue;
        inputNumber--;
        if (inputNumber < 0)
            continue;
        if (inputNumber >= scene.options.length)
            continue;
        console.log(inputNumber);
        sceneFunction = scene.options[inputNumber].scene;
    }
}
run(scenes.intro);
