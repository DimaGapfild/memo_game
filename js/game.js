
let randomNumb = (min,max) => {
	return Math.floor(Math.random() * ( max - min ) + min);
}


// let randN = require ('randomNumber')

// import {randomNumb} from 'randomNumber';

// chaching

const field = document.querySelector('.game-field'),
		modal = document.querySelector('.modal'),
		closeModal = modal.querySelector('.modal-close-button'),
		nextGame = modal.querySelector('button.modal-next-game-button'),
		cardsArr = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8],
		fieldCells = [];
let cells

// end chaching

// ------------ VIEW -----------------------//
class GameView {
	viewCard(card){field.innerHTML+=card;}
	cellClick() {
		this.classList.toggle('open')
		let id = this.dataset.cardId
		let cellCard = cardStorage.cards.filter((card) => card.id==id) // we have new arr with singl element
		checkCards.addCard(cellCard[0]) // so we send only obj
	}
	flipCard(e) {e.target}
	resetStyle(){
		// clear cells style with delay 2s
		setTimeout(()=>{
			cells.forEach(cell => {
			cell.classList.remove('open')
		})
		},500) // in future should be a variable with downgrade method
	}
	removeCard(ids){
		this.resetStyle()
		ids.forEach(id => {
			cells.forEach(cell => cell.dataset.cardId == id && (cell.style.backgroundColor = "gray") )
		})
	}
}

const gameView = new GameView();

// ---------------------MODEL --------------//
class Card {
	constructor(id,value){
		this.id = id
		this.value = value
		this.body = `<div class="game-cell" data-card-id="${this.id}">${this.value}</div>`
		this.open = false
	}
}
class CardStorage {
	constructor(){
		this.cards = []
	}
	addCard (card) { this.cards.push(card)}
	removeCard(ids){
		ids.forEach(id => {
		// method for removing cards from the storage
		let remove = (index) => {this.cards.splice(index,1);}
		// filtering element for remove by value
			this.cards.map((card,index) => {
				card.id === id && remove(index)
			})
		})
	}
}
const cardStorage = new CardStorage() 


// --------------------CONTROLLER -----------//
class GameController {
	buildField(){
		let count = 0;
		while (cardsArr.length>0) {
			let i = randomNumb(0,cardsArr.length)
			let card = new Card(count,cardsArr[i])
			count += 1
			fieldCells.push(card)
			cardStorage.addCard(card)
			cardsArr.splice(i,1)
			gameView.viewCard(card.body)
		}
		cells = field.querySelectorAll('.game-cell')
		gameController.cellClickListener();
	}	
	// clickListener () {
	cellClickListener(){
		cells.forEach((cell) => cell.addEventListener('click', gameView.cellClick))
	}
	
	nextGameListener(){
		nextGame.addEventListener('click', this.reloadWindow)
	}
	
	closeModalListener(){
		closeModal.addEventListener('click', this.closeModalWindow)
	}
	removeCard(ids){
		ids.forEach(id => {
			cells.forEach(cell => cell.dataset.cardId == id && cell.removeEventListener('click', gameView.cellClick))
		})
	}
	gameEnd(){
		modal.classList.add('show')
		this.closeModalListener()
		this.nextGameListener()
	}
	gameStage(){
		cardStorage.cards.length < 1 && this.gameEnd()
	}
	closeModalWindow(){
		modal.classList.remove('show')
	}
	reloadWindow(){
		modal.classList.remove('show')
		setTimeout(() => {location.reload();},1000)
	}
	
}
const gameController = new GameController();

class CheckCards {
		constructor(){
			this.localStorage = []
			this.observers = [gameController,cardStorage,gameView]
		}
		// if tempStorage has > 2 cards reset storage arr
		checkStorage() {if (this.localStorage.length > 1) {this.localStorage = []}}
		// function for adding cards to tempStorage
		addCard (card) {
			this.checkStorage() // check if tempStorage has 2 crads
			this.localStorage.push(card)
			this.localStorage.length === 2 && this.checkValue()
		}
		// function for checking cards for == 
		checkValue(){
			this.localStorage[0].value === this.localStorage[1].value ? this.successAction(this.localStorage[0].value) : this.faildAction()
		}
		// if check return success
		successAction(value){
			this.removeCommand(value)
			gameController.gameStage()			
			console.log(`bingo`)
		}
		// if check return fail
		faildAction(){
			gameView.resetStyle()
			console.log(`oops, lets try againe`)
		}
		// observable function for cardStorage, gameview and gameController
		removeCommand(value){
			const cardsId = []
			cardStorage.cards.map(card => card.value === value && cardsId.push(card.id))
			this.observers.map(obs => obs.removeCard(cardsId))
		}
	}
const checkCards = new CheckCards();

gameController.buildField();
// let gameCreate = new Promise((res,rej) => {
// 	buildField();
// });
// 	gameCreate().then(
// 		function onSuccess(){
// 			console.log('done')
// 			gameController.cellClickListener();
// 		},
// 		function onFail(){
// 			console.log('error')
// 		}
			 
// 		)
// 	.catch (error => {console.log(error)})


	