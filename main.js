const main = document.querySelector("#main");
const btnNext = document.querySelector(".btn.next");
const btnPrevius = document.querySelector(".btn.previus");
const btnVeloce = document.querySelector(".btn.veloce");
const btnStopVeloce = document.querySelector(".btn.stop"); 
const btnMenu = document.querySelector("#menuButton .open");
const sideBar = document.querySelector("#sideBar");
const submit = document.querySelector("#submit");
const resetArray = document.querySelector("#resetArray");
const delayInput = document.querySelector("#delayAlgoritmo input");
const nElementiInput = document.querySelector("#numeroElementi input");

//colori
const primoColore = getComputedStyle(document.documentElement).getPropertyValue("--primoColore");
const secondoColore = getComputedStyle(document.documentElement).getPropertyValue("--secondoColore");
const baseColore = getComputedStyle(document.documentElement).getPropertyValue("--bar");

//lista di elementi
var listElm = [];
//lista delle altezze
var listHeightDefault = [];
var listHeight = [];
//lista contente il return della funzione sort ([0] = elmUsati, [1] = listStep)
var arrRisultato = [];
//lista con gli indici dei valori che stiamo per scambiare
var elmUsati= [];
//lista con tutti gli step (2 dimensione)
var listStep = [];
//step della fase di sorting (inizio -1 perche' quando clicco fa step++)
var step = -1;
//variabile per fermare il veloce
var fermaVeloce = false;
var Exchange = false, Bubble = true;

var nElement = 100;
const maxHeight = 500;
var delayTime = 20;
const rangeFrequenza = [0, 1800];

//creo tutti gli elementi
setupPage();

//apro la sidebar
btnMenu.addEventListener("click", () => {
	sideBar.classList.toggle("close");
	fermaVeloce = true;
});

//chiudo la sidebar se premo invio
submit.addEventListener("click", () => {
	var radios = document.getElementsByName('nomeAlgoritmo');
	var sceltaFatta = false;
    for (var radio of radios) {
		if (radio.checked){
			if (radio.id == "ExchangeScelta"){
				if (!Exchange){
					Exchange = true;
					sceltaFatta = true;
				}
			}else if(radio.id == "BubbleScelta"){
				if (Bubble){
					Bubble = true;
					sceltaFatta = true;
				}
			}
		}
	}
	if (!isNaN(delayInput.value) && delayInput.value != ""){
		delayTime = delayInput.value;
	}
	if (!isNaN(nElementiInput.value) && nElementiInput.value != ""){
		listElm = [];
		listHeight = [];
		nElement = nElementiInput.value;
		//ricreo la pagina con il nuovo nElement
		removeAllBar();
		setupPage();
	}
	sideBar.classList.add("close");
	//se e' stato scelto un algoritmo metto apposto l'array
	if (sceltaFatta){
		sceltaAlgoritmo();
	}
});

//resetta l'array se premo reset
resetArray.addEventListener("click", () => {
	submit.click();
	//rimuovo gli eventuali vecchi colori
	if (step >= 0 && step < elmUsati.length){
		setColor(listElm, elmUsati[step][0], baseColore);
		setColor(listElm, elmUsati[step][1], baseColore);
	}
	listHeight = copyArray(listHeightDefault, listHeight);
	step = 0;
	//aggiorno le altezze data listHeight
	setHeight(listHeight);
});

//fermo il veloce
btnStopVeloce.addEventListener("click", () => {fermaVeloce = true})

//button click = next step
btnNext.addEventListener("click", () => {
	//se gli step sono minori del numero massimo di step possibili vado avanti
	if (step < elmUsati.length){
		step++;
		//rimuovo il vecchio colore se non e' il primo step
		if (step > 0){
			setColor(listElm, elmUsati[step-1][0], baseColore) 
			setColor(listElm, elmUsati[step-1][1], baseColore);
		}
		//aggiorno le altezze
		setHeight(listStep[step]);
		//se non e' l'ultimo array metto i colori
		if (step != elmUsati.length){
			setColor(listElm, elmUsati[step][0], primoColore);
			setColor(listElm, elmUsati[step][1], secondoColore);
			//faccio il suono
			// createSound(listHeight[elmUsati[step][0]], 0.1);
		}
	}
});

btnPrevius.addEventListener("click", () => {
	if (step > 1){
		step--;
		//rimuovo il vecchio colore (a meno che il precedente non era l'ultimo elemento)
		if (step > 0 && step+1 != elmUsati.length){
			setColor(listElm, elmUsati[step+1][0], baseColore);
			setColor(listElm, elmUsati[step+1][1], baseColore);
		}
		//metto il nuovo colore
		setColor(listElm, elmUsati[step][0], primoColore);
		setColor(listElm, elmUsati[step][1], secondoColore);
		//faccio il suono
		// createSound(listHeight[elmUsati[step][0]], 0.2);
		//aggiorno le altezze
		setHeight(listStep[step]);
	}
});

btnVeloce.addEventListener("click", cicleStep);
//puo' capitare che facendo vari Next Veloce insieme si possano creare diversi loop che portano a problemi, i multeplici controllo si step < elmUsati.length elminano il problema
//funzione async per aspettare il delay
async function cicleStep(){
	fermaVeloce = false;
	while (step < elmUsati.length && !fermaVeloce){
		await delay(delayTime);
		step++;
		//rimuovo il vecchio colore se non e' il primo step
		if (step > 0 && step < elmUsati.length){
			setColor(listElm, elmUsati[step-1][0], baseColore);
			setColor(listElm, elmUsati[step-1][1], baseColore);
		}
		//se non e' l'ultimo array metto i colori
		if (step < elmUsati.length){
			//aggiorno le altezze
			setHeight(listStep[step]);
			
			setColor(listElm, elmUsati[step][0], primoColore);
			setColor(listElm, elmUsati[step][1], secondoColore);
			//faccio il suono
			// createSound(listHeight[elmUsati[step][0]], 0.1);
		}
	}
	if (!fermaVeloce){
		fermaVeloce = true;
		//primo rosso
		setColor(listElm, 0, primoColore);
		for (let i = 1; i < nElement; i++){
			await delay(delayTime);
			setColor(listElm, i-1, baseColore);
			setColor(listElm, i, primoColore);
			createSound(listHeight[i], 0.1);
		}
		await delay(delayTime);
		setColor(listElm, nElement-1, baseColore);
		step = elmUsati.length;
	}
}

function createElement(){
    for (var i = 0; i < nElement; i++){
        const elm = document.createElement("div");
        elm.classList.add("bar");
        listElm.push(elm);
        document.getElementById("main").appendChild(elm);
    }
}

//se ridimensiono la pagina si risetta la width di ogni elemento
window.addEventListener("resize", setWidth);
function setWidth(){
    const width = window.innerWidth;
    for (let elm of listElm){
        elm.style.setProperty("--width", width / nElement);
    }
}

function createHeight(){
	var listHeight = [];
	var height;
    for (var i = 0; i < nElement; i++){
        height = Math.random() * maxHeight;
        listHeight.push(height);
    }
	return listHeight;
}

function setHeight(list){
    for (var i = 0; i < list.length; i++){
        listElm[i].style.setProperty("--height", list[i]);
    }
}

//setto il colore degli elementi che si devono scambiare
function setColor(list, index, colore){
	//aggiorno gli usati in questo momento
	list[index].style.background = colore;
}
//aspetto un tot tempo
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

//genera un suono
function createSound(frequency, time){
	frequency = frequency / maxHeight * (rangeFrequenza[1] - rangeFrequenza[0]) + rangeFrequenza[0];
	var context = new AudioContext()
	var o = context.createOscillator()
	o.frequency.value = frequency
	var  g = context.createGain()
	o.connect(g)
	g.connect(context.destination)
	o.start(0)
	o.stop(time)
}

//SORTING CALL
function sceltaAlgoritmo(){
	if (step >= 0 && step != elmUsati.length){
		//resetto gli eventuali colori e gli step
		setColor(listElm, elmUsati[step][0], baseColore);
		setColor(listElm, elmUsati[step][1], baseColore);
		//resetto gli step
		step = -1;
		//fermo l'eventuale veloce
	}
	listHeight = copyArray(listHeightDefault, listHeight);
	elmUsati = [];

	if (Exchange){
		arrRisultato = exchangeSort(listHeight, elmUsati);
	}else if (Bubble){
		arrRisultato = bubbleSort(listHeight, elmUsati);
	}

	listStep = arrRisultato[0];
	elmUsati = arrRisultato[1];
}

function copyArray(arr1, arr2){
	for (let i = 0; i < arr1.length; i++){
		arr2[i] = arr1[i];
	}
	return arr2;
}

function removeAllBar(){
    var allElement = document.querySelectorAll(".bar");
    for (elm of allElement) {
        main.removeChild(elm);
    }
}

function setupPage(){
	//creo gli elementi
	createElement();
	//gli setto una grandeza
	setWidth();
	//creo una randomica altezza
	listHeightDefault = createHeight();
	listHeight = copyArray(listHeightDefault, listHeight);
	//aggiorno le altezze data listHeight
	setHeight(listHeight);
	//sceglo un algoritmo di default
	sceltaAlgoritmo();
}
