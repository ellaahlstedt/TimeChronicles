interface Scene {
    title: string,
    desc: string,
    options: Option[]
}

interface Option {
    text: string,
    scene: () => Scene,
    sideEffects?: () => any,
}
let inventory = {
    add: function (item: any) {

    }
}
let scenes = {
    intro: function (): Scene {
        return {
            title: 'Introduction',
            desc: `You’re a wizard in a group of adventures undertaking quests. When you awake in your inn one day, after a particularly gruelling quest, you find a letter claiming to be written by yourself even though you have no memory of writing such a thing. In the letter there is a strange artifact that can allegedly bring anyone who activates it back in time. The letter claims that you must go and retrieve the same artifact from where it was originally stored and then travel back in time to put together this letter in order for the space-time continuum to remain stable.`,
            options: [
                {
                    text: "Nonsense! You don’t believe in any of this! You should investigate if this artifact even does anything at all.",
                    scene: scenes.avoidScam,
                    sideEffects: function () {
                        inventory.add("Test item")
                    }
                },
                {
                    text: "This sounds pretty serious! You should bring this letter and the artifact to your companions and see if they have any insights.",
                    scene: scenes.companions,
                }
            ]
        };
    },

    companions: function (): Scene {
        return {
            title: `Companions`,
            desc: `Entering the bar in which the companions of yours reside, you hastily gather your party to announce the conspicuous quest. Given your history of embarking on many dangerous quests in this company before, it comes as no surprise that they’re willing to undertake this one right away. The letter addresses the location of the sought artifact, a great castle in the woods not too far from where you currently are, so that’s where you along with your companions will be heading next.`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.CastleEntry,
                }
            ],
        }
    },

    avoidScam: function (): Scene {
        return {
            title: `Avoiding scams`,
            desc: `As you begin trying to interact with the artifact, running your fingers along the clock-like design, you quickly notice the room darkening and you can see the night sky through a window. Unless this is a powerful illusion then this artifact seems to have actually turned back time. So it wasn't really a trick, was it? Confounded with having your only reasonable expectations broken, you decide to:`,
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

    endingPhantomTrick: function (): Scene {
        return {
            title: `Ending - The phantom trick`,
            desc: `Convinced the quest is a treacherous waste of time, you move on, business as usual. Some time shortly thereafter, you’re approached by a cloaked figure, it turns dark and you feel no more.`,
            options: [
                {
                    text: "Game over",
                    scene: scenes.intro,
                }
            ],
        }
    },

    CastleEntry: function (): Scene {
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
                    scene: scenes.dungeons,
                },
                {
                    text: "Listen for signs of danger.",
                    scene: scenes.entryInspection,
                }
            ],
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
            ]
        };
    },

    dungeons: function (): Scene {
        return {
            title: 'Infiltrating the castle - Dungeons',
            desc: `Committing to what appears to be a stealthier route, you go downwards towards the dimly lit and seemingly desolate dungeons. The treversal goes smoothly and you spot something different. Engravings on a wall, depicting an odd object on a throne in a rather vague frame. Regardless of what direction may be optimal at one point or another, you proceed to walk the only path before you now that doesn’t turn away from the castle’s chambers.`,
            options: [
                {
                    text: "Continue",
                    scene: scenes.stairs,
                }
            ]
        };
    },

    entryInspection: function (): Scene {
        return {
            title: 'Infiltrating the castle - Inspection of entry',
            desc: `Taking the time not to run in blind, you listen very closely for any signs of what’s happening in there. You hear the sound of a faint breath and sense heat in irregular waves from the front gate. The dungeons echo with many light footsteps in bursts.`,
            options: [
                {
                    text: "Enter front gate.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Enter dungeons.",
                    scene: scenes.dungeons,
                }
            ]
        };
    },

    stairs: function (): Scene {
        return {
            title: `Infiltrating the castle - Stairwell`,
            desc: `Having now exited the dungeons, you stand before a stairwell leading to three different floors. Potential points of interest on these floors are respectively a kitchen, a library and a hallway with many smaller rooms.`,
            options: [
                {
                    text: "Explore first floor.",
                    scene: scenes.frontGate,
                },
                {
                    text: "Explore second floor.",
                    scene: scenes.dungeons,
                },
                {
                    text: "Explore third floor.",
                    scene: scenes.entryInspection,
                }
            ],
        }
    },

    artifactChamber: function (): Scene {
        return {
            title: `Infiltrating the castle - artifact chamber`,
            desc: `You come before a gate demanding a password for access to its contents. Many words and phrases that you’ve picked up from observations throughout the castle crosses your mind, but you are hesitant to propose any incorrect password given the risk of disallowance to pass should you lack information or misinterpret the key to this lock more than once. It won’t budge through manipulation of space or time either, the heavy gate’s security spell is immune against the art of time travel familiar to it. You:`,
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
        }
    },

    artifactChamberKnocking: function (): Scene {
        return {
            title: `Infiltrating the castle - artifact chamber - Go knocking`,
            desc: `You knock on the gate, but nothing happens. You knock again and this time with all your might as hard as you can, but alas, it’s to no effect...Reconsidering everything, you:`,
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
        }
    },
};

function getSceneId(sceneFunction: () => Scene): string | null {
    for (let id of Object.keys(scenes)) {
        if ((scenes as any)[id] === sceneFunction) {
            return id;
        }
    }
    return null;
}

function run(sceneFunction: () => Scene) {
    while (true) {
        let scene = sceneFunction();
        console.log('   ' + scene.title);
        console.log();
        console.log(scene.desc);
        console.log();
        console.log('Options:')
        for (let i = 0; i < scene.options.length; i++) {
            console.log(`${i + 1}. ${scene.options[i].text}`)
        }
        function valueAssign(n) {
            alert(n);
        }
        let inputText = prompt("");
        if (inputText === null) continue;

        if (inputText.startsWith("skip to ")) {
            let level = inputText.slice("skip to ".length);
            console.log(level);
            let wantedScene = (scenes as any)[level];
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

        let inputNumber = parseInt(inputText);
        if (inputNumber === null || isNaN(inputNumber)) continue;
        inputNumber--;
        if (inputNumber < 0) continue;
        if (inputNumber >= scene.options.length) continue;

        console.log(inputNumber)

        sceneFunction = scene.options[inputNumber].scene;
    }

}
run(scenes.intro)