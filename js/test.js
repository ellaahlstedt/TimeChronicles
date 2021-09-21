const pages = [ 
    { 
        page: 1,
        text: "This is page one",
        choices: [
                {
                    choice: 1,
                    text: "Go to 1",
                    browseto: 1 
                },
                {
                    choice: 2, 
                    text: "Go to 3",
                    browseto: 3
                }
                ]
    },
    {
        page: 2,
        text: "This is page numero dos"
    }, 
    {
        page: 3,
        text: "This is the tredje page",
        choices: [
            {
                choice: 1,
                text: "Go back to page 1",
                browseto: 1
            }
        ]
    },
    {
        page: 4, 
        text: "This is page nelja"
    }
];

console.log( returnIndexOfPage(2));
let currentChoices = pages[0].choices;
console.log(currentChoices);
console.log('from room 1 you can move to');
currentChoices.forEach( choice => console.log(choice.browseto));


function returnIndexOfPage( pagenr ) {  return pages[pagenr].page; };