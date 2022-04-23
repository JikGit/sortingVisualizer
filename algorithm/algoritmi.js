function exchangeSort(arr, elmUsati){
	//2d array contenente tutti gli array ogni volta che si esegue uno scambio
	var arrStep = [];
	var index = 0;
	//array contenete il return (arrStep + elmUsati)
	var arrRisultato = [];
	//index degli elementi usati
	var elmUsati= [];
	var tmp;

	for (var i = 0; i < arr.length; i++){
		for (var x = i+1; x < arr.length; x++){
			if (arr[x] < arr[i]){
				//aggiorno il numero di array in arrStep e gli inidici di chi sto per scambiare
				updateList(arrStep, arr, index);
				updateIdexUsati(elmUsati, index, i, x);
				index++;
				//swap
				tmp = arr[i];
				arr[i] = arr[x]
				arr[x] = tmp;
			}
		}
	}

	updateList(arrStep, arr, index);
	//creo un array con gli elementi da ritornare
	arrRisultato.push(arrStep);
	arrRisultato.push(elmUsati);
	return arrRisultato;
}

function bubbleSort(arr, elmUsati){
	//2d array contenente tutti gli array ogni volta che si esegue uno scambio
	var arrStep = [];
	var index = 0;
	//array contenete il return (arrStep + elmUsati)
	var arrRisultato = [];
	//index degli elementi usati
	var elmUsati= [];
	var tmp;
	var swapped = true;

	while (swapped == true){
		swapped = false;
		for (var i = 1; i < arr.length; i++){
			if (arr[i-1] > arr[i]){
				//aggiorno il numero di array in arrStep e gli inidici di chi sto per scambiare
				updateList(arrStep, arr, index);
				updateIdexUsati(elmUsati, index, i, i-1);
				index++;
				//swap
				tmp = arr[i];
				arr[i] = arr[i-1]
				arr[i-1] = tmp;
				swapped = true;
			}
		}
	}
	updateList(arrStep, arr, index);
	//creo un array con gli elementi da ritornare
	arrRisultato.push(arrStep);
	arrRisultato.push(elmUsati);
	return arrRisultato;
}



//update della lista in questo momento e degli index che stiamo usando
function updateList(list, arr, index){
	//aggiungo l'ultimo array ordinato
	list.push([]);
	//agiorno l'array
	for (var i = 0; i < arr.length; i++){
		list[index].push(arr[i]);
	}
}

function updateIdexUsati(elmUsati, index, index1, index2){
	elmUsati.push([]);
	//0 = principale, 1 = quello per cui lo scambiamo
	elmUsati[index].push(index1);
	elmUsati[index].push(index2);
}

