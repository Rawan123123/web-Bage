//sitting game name
let gameName = 'Guess The Word';
document.title = gameName;

document.querySelector('h1').innerHTML = gameName;
document.querySelector('footer').innerHTML = `${gameName} game created by Rawan Adel`;

// setting game option
let numbersOfTries = 6;
let NumbersOfLetters = 6;

//manage words
let wordToGuess = "";
const words =['create' , 'Update' , 'Delete' , 'Master' , 'Branch' , 'Mainly' , 'Elzero' , 'School'];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

//manage inputs
function generateInput(){
    const inputContainer = document.querySelector('.inputs');

    //create main try div
    for(let i=1 ; i<=numbersOfTries ; i++){
        const tryDiv = document.createElement('div');
        tryDiv.className = `try-${i}`;
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        
        if(i !== 1) tryDiv.classList.add('disabled-input');

        //create inputs
        for(let j=1 ; j<=NumbersOfLetters ; j++){
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `guess-${i}-letters-${j}`;
            input.setAttribute('maxlength' , '1');
            tryDiv.appendChild(input);
        }
        
        inputContainer.appendChild(tryDiv);

        inputContainer.children[0].children[1].focus();

        // disabled all inputs except first one
        const inputsInDisabledDiv = document.querySelectorAll('.disabled-input input');
        inputsInDisabledDiv.forEach((input)=> input.disabled = true)
            
        
        const inputs = document.querySelectorAll('input');

        inputs.forEach((input , index)=>{
            //convert input to uppercase
            input.addEventListener('input' ,function(){
                this.value = this.value.toUpperCase();
                const nextInput = inputs[index + 1];
                
                //check if there is next input
                if(nextInput)  nextInput.focus();
            })
            input.addEventListener('keydown' ,function(e){
                // console.log(e);
                const currentIndex = Array.from(inputs).indexOf(e.target); //arrayكلها جبت منها inputs لعناصر بتاع ال 
                // console.log(currentIndex);
                if(e.key === 'ArrowRight'){
                    const nextInput =currentIndex + 1;
                    if(nextInput < inputs.length)  inputs[nextInput].focus();
                }
                else if(e.key === 'ArrowLeft'){
                    const prevousInput = currentIndex - 1;
                    if(prevousInput >=0)  inputs[prevousInput].focus();
                }
            })
        })
    }
}

let currentTry = 1;
const guessButton = document.querySelector('.check');
guessButton.addEventListener('click' , handleGuess);
console.log(wordToGuess);

function handleGuess(){
    let successGuess = true;
    for(let i=1 ; i <= NumbersOfLetters ; i++){ 
        const inputFeild = document.querySelector(`#guess-${currentTry}-letters-${i}`); //input user,s letter
        const letter = inputFeild.value.toLowerCase(); //input useris letter in lower case
        const actualLetter = wordToGuess[i -1]; //actual letter in the word

        //game logic
        if(letter === actualLetter){
            inputFeild.classList.add('in-place');
        }
        else if(wordToGuess.includes(letter) && letter !== ""){
            inputFeild.classList.add('not-in-place');
            successGuess = false;
        }
        else{
            inputFeild.classList.add('no');
            successGuess = false;
        }
    }
    //check if user win or lose
    let messageArea = document.querySelector('.message');
    if(successGuess) 
    {
        messageArea.innerHTML = `you win, the word is <span>${wordToGuess}</span>`
        getHintButton.disabled = true;
        if(numberOfHints === 2){
            messageArea.innerHTML = '<p>Congratz, You Did not Use Any Hint</p>'
        }

        //add disabled class at tryDiv
        let allTries = document.querySelectorAll('.inputs > div');
        allTries.forEach((tryDiv) => tryDiv.classList.add('disabled-input'))

        // /disabled guess button
        guessButton.disabled = true;
    }
    else {
        document.querySelector(`.try-${currentTry}`).classList.add('disabled-input');
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => input.disabled = true);
        currentTry++;

        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => input.disabled = false);

        //check if still ther is guess element in gema
        let el = document.querySelector(`.try-${currentTry}`);
        if(el){
            document.querySelector(`.try-${currentTry}`).classList.remove('disabled-input');
            el.children[1].focus();
        }
        else{
            guessButton.disabled = true;
            getHintButton.disabled = true;
            messageArea.innerHTML = `You Lose, The Word Is <span>${wordToGuess}</span>`;
        }
    }
}

//hint siction
let numberOfHints  = 2;
document.querySelector('.hint span').innerHTML = `${numberOfHints}`;
const getHintButton = document.querySelector('.hint');
getHintButton.addEventListener('click' , getHint);

function getHint(){
    if(numberOfHints > 0){
        numberOfHints--;
        document.querySelector('.hint span').innerHTML = numberOfHints;
    }
    if(numberOfHints == 0 ){
        getHintButton.disabled = true;
    }

    //ceck if inputs is disabled or not
    const enabledInputs = document.querySelectorAll('input:not([disabled])');

    //find all empty input in enterd word
    const emptyInabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    // console.log(emptyInabledInputs);

    if(emptyInabledInputs.length > 0){

        //find empty random index
        const randomIndex = Math.floor(Math.random() * emptyInabledInputs.length); //اي رقم عشوائي من الخانات الفارغه

        const randomInput = emptyInabledInputs[randomIndex]; // الحقل الفارغ نفسه

        //give the index of random input
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput); //اندكس الحقل الفارغ اللي جبته

        // console.log(randomIndex);
        // console.log(randomInput);
        // console.log(indexToFill);

        if(indexToFill !== -1){ //check if the index in the lenght of word
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}
// handel back space
document.addEventListener('keydown' , handleBackSpace);

function handleBackSpace(event){
    if(event.key === 'Backspace'){
        const inputs = document.querySelectorAll('input:not([disabled])');
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        // console.log(currentIndex);  focused element
        if(currentIndex > 0){
            const currentInput = inputs[currentIndex];
            const prevousInput = inputs[currentIndex - 1];
            currentInput.value = "";
            prevousInput.value = "";
            prevousInput.focus();
        }
    }
}

window.onload =function(){
    generateInput();
}