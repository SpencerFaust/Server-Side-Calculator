$(document).ready(onReady);

console.log('JS initialized');

let action = '';

function onReady() {
    console.log('JQ initialized');
    $('#clear').on('click', clear);
    $('#equals').on('click', problemCapture);
    $('.action').on('click', actionMethod);
    $('.secondCalcNumber').on('click', secondaryNumbers);
    $('.operator').on('click', operator);
    $('#clearToo').on('click', onClear);
    $('#equalsToo').on('click', equate);
    getAnswerList();
    onAnswer();
};

function problemCapture() {
    $.ajax({
        url: '/newProblem',
        method: 'POST',
        data: {
            numberOne: $('#numberOne').val(),
            numberTwo: $('#numberTwo').val(),
            actionImposed: action,
            answer: '', 
        }
    }).then(function() {
        clear();
        getAnswerList();
    })
}

function clear() {
    $('.numberInput').val('');
}

function actionMethod() {
    action = $(this).val();
}    

function getAnswerList() {
    $.ajax({
        url: '/problems',
        method: 'GET'
    }).then(function(response) {
        console.log(response);
        postAnswer(response);
    })
}

function postAnswer(answerArray) {
    if (answerArray.length === 0) {
        return false;
    }
    $('#thisAnswer').empty();
    $('#previousProblems').empty(); 
    $('#thisAnswer').append(`<h1>${answerArray[0].answer}</h1>`);
    for (i = 0; i < answerArray.length; i++) {
        $('#previousProblems').append(`
        <li>
        ${answerArray[i].numberOne} 
        ${answerArray[i].actionImposed} 
        ${answerArray[i].numberTwo} =
        ${answerArray[i].answer} 
        `)
    }
}

//Code for the secondary calculator
let firstInput
let secondInput
let theOperator
let currentInput = '';
let singleCalculation = true;

function secondaryNumbers() {
    currentInput += $(this).val();
    $('#disabledInput').replaceWith(`<input placeholder="${currentInput}" disabled id="disabledInput"/>`);
};

function operator() {
    if (!currentInput) {
        alert('Please enter your calculation.');
        return false;
    }
    if (singleCalculation) {
        firstInput = Number(currentInput)
        theOperator = $(this).val();
        $('#firstInput').append(`${firstInput}  ${theOperator}`);
        $('.operator').prop('disabled', true);
        singleCalculation = false;
        $('#disabledInput').replaceWith(`<input placeholder="" disabled id="disabledInput"/>`);
        currentInput = '';
    } else {
        alert('Clear to start over.');
    }
}

function onClear() {
    firstInput = '';
    theOperator = '';
    currentInput = '';
    singleCalculation = true;
    $('#disabledInput').replaceWith(`<input placeholder="" disabled id="disabledInput"/>`)
    $('#firstInput').replaceWith(`<div id="firstInput"></div>`);
    $('.operator').prop('disabled', false);
}

function equate() {
    if (!firstInput) {
        alert('Please enter your calculation.');
        return false;
    } 
    secondInput = Number(currentInput);
    console.log(firstInput, secondInput);
    $.ajax({
        url: '/second-problem-list',
        method: 'POST',
        data: {
            first: firstInput,
            second: secondInput,
            operator: theOperator,
            answerToo: ''
        }
    }).then(function() {
        onAnswer();
        onClear();
    })
};

function onAnswer () {
    $.ajax({
        url: '/second-problem-list',
        method: 'GET'
    }).then(function(response) {
        $('#secondList').empty();
        $('#secondAnswer').empty();
        $('#secondAnswer').append(`<h1>${response[0].answerToo}</h1>`)
        for (i = 0; i < response.length; i++) {
            $('#secondList').append(`
            <tr>
                <td>${response[i].first} ${response[i].operator} ${response[i].second} = ${response[i].answerToo} </td>
            </tr>
            `)
        }
    })
}

