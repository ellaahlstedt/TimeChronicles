const pages = [ 
    { 
        page: 1,
        title: "Introduction",
        text: "You’re a wizard in a group of adventures undertaking quests. When you awake in your inn one day, after a particularly gruelling quest, you find a letter claiming to be written by yourself even though you have no memory of writing such a thing. In the letter there is a strange artifact that can allegedly bring anyone who activates it back in time. The letter claims that you must go and retrieve the same artifact from where it was originally stored and then travel back in time to put together this letter in order for the space-time continuum to remain stable.",
    },
    {
        page: 2,
        text: "This is page numero dos",
        choices: [
            {
                choice: 1,
                text: "Nonsense! You don’t believe in any of this! You should investigate if this artifact even does anything at all.",
                browseto: 3 
            },
            {
                choice: 2, 
                text: "This sounds pretty serious! You should bring this letter and the artifact to your companions and see if they have any insights.",
                browseto: 5
            }
            ]
    }, 
    {
        page: 3,
        text: "This is the tredje page",
    },
    {
        page: 4, 
        text: "This is page nelja"
    }
];


// console.log( 'from room 1 you can move to' );
// console.log( returnIndexOfPage(1));

// let currentChoices = pages[1].choices;
// console.log(currentChoices);
// currentChoices.forEach( choice => console.log(choice.browseto));

pagesnumb = 0;


function returnIndexOfPage( pagenr ) {  return pages[pagenr].page; };

document.getElementById('pageNrLeft').innerHTML = returnIndexOfPage(1);
document.getElementById('pageNrRight').innerHTML = returnIndexOfPage(2);


function returnChapterTitle( chaptitle ) {  return pages[chaptitle].title; };
document.getElementById('pageTitle').innerHTML = returnChapterTitle(0);

function returnpageText( pageText ) {  return pages[pageText].text; };
document.getElementById('text').innerHTML = returnpageText(0);

function returnChoices( pageChoices, choicenr ) {  return pages[pageChoices].choices[choicenr].text; };
document.getElementById('choice1').innerHTML = returnChoices(1,0);

function returnChoices( pageChoices, choicenr ) {  return pages[pageChoices].choices[choicenr].text; };
document.getElementById('choice2').innerHTML = returnChoices(1,1);



// for (var i = 0; i < pages[2].choices.length; i++) {
//     console.log(i + 1 + ". " + pages.choices[i].text);
// }

// for (var i = 0; i < scene.options.length; i++) {
//     console.log(i + 1 + ". " + scene.options[i].text);
// }

// $(document).ready(function(){
//     $("#choice1").click(function() {
//       $('body').toggleClass("test");
//     });
//   })

  function changePage() {

  }

//   if button is clicked = changes scene to another depening on choice