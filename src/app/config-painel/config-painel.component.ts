import { Component, OnInit, ɵConsole } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { element } from 'protractor';

@Component({
  selector: 'app-config-painel',
  templateUrl: './config-painel.component.html',
  styleUrls: ['./config-painel.component.css']
})
export class ConfigPainelComponent implements OnInit {

  probMutacao: number;
  probCruzamento: number;
  resolution: number;
  populationSize: number;
  intervalMax: number;
  intervalMin: number;
  minFunctionInTheInterval: number;
  maxFunctionInTheInterval: number;
  maxNumOfGenerations: number;
  bestInd: individual[];
  numOfBestToKeep:number;
  numCurrentGeneration: number;
  generations: any[];
  couplesSelectionMode: string;
  checkBoxSelectedItens: string[];
  numOfIndividualsInTourney: number;
  numOfElitismInd: number;

  graphData: any;
  functionDataSet: any;
  generationsDataSets: any[];
  xRealValues: number[];
  yRealValues: number[];
  colors: string [];
  color: number;
  isGraphResponsive: boolean;
  showGraph1: string;
  showGraph2: string;
  performanceData: any;
  bestIndividualData: any;

  constructor() { }

  ngOnInit() {
    console.log("ngOnInit");

    this.probCruzamento = 0.6;
    this.probMutacao = 0.01;
    this.resolution = 10;
    this.populationSize = 50;
    this.intervalMax = 512;
    this.intervalMin = 0;
    this.maxNumOfGenerations = 70;
    this.bestInd = [];
    this.numOfBestToKeep = 5;
    this.numCurrentGeneration = 0;
    this.generations = [];
    this.isGraphResponsive = true;
    this.showGraph1 = 'block';
    this.showGraph2 = 'none';
    this.initGensDataset();
    this.drawFunction();
    this.couplesSelectionMode = "Roleta"
    this.checkBoxSelectedItens = ["elitism"];
    this.numOfIndividualsInTourney = 4;
    this.numOfElitismInd = 2;
    
    
    

    
  }

  numOfNewIndividual()
  {
    let numOfNewIndividual: number;
    if(this.checkBoxSelectedItens.indexOf("elitism") >= 0)
    {
      numOfNewIndividual = this.populationSize - this.numOfElitismInd;
    }
    else
    {
      numOfNewIndividual = this.populationSize;
    }
    console.log("numOfElitismInd" + numOfNewIndividual);
    return numOfNewIndividual;
  }

  initGensDataset()
  {
    console.log("initGensDataset")
    this.initIntervalData();
    this.generationsDataSets = [];
    this.color = 0;
    this.colors = [];
  }

  initIntervalData()
  {
    console.log("initIntervalData")
    this.xRealValues = this.getIntervalLabels();
    this.yRealValues = this.xRealValues.map(this.functionToAnalise);
    this.minFunctionInTheInterval = this.minArray(this.yRealValues);
    this.maxFunctionInTheInterval = this.maxArray(this.yRealValues);
    //console.log("minFunctionInTheInterval" + this.minFunctionInTheInterval);

  }

  minArray(arr: number[])
  {
    let minValue = arr[0];
    for (let index = 1; index < arr.length; index++) 
    {
      ///se o minValue é mario que o elemento do array, então ele não o menor e deve ser trocado
      if(minValue > arr[index]) minValue = arr[index];   
    }
    console.log(minValue);
    return minValue;
  }

  maxArray(arr: number[])
  {
    let maxValue = arr[0];
    for (let index = 1; index < arr.length; index++) 
    {
      if(maxValue < arr[index]) maxValue = arr[index];   
    }
    return maxValue;
  }

  getColorStr()
  {
    return "#"+this.color.toString(16).toLocaleUpperCase().padStart(6,"0");
  }

  drawFunction(aditionalDatasets: any [] = [])
  {
    //console.log("drawFunction");
    //console.log(aditionalDatasets);
    this.initIntervalData();
    this.functionDataSet =  
    {
      label: 'Fuction f(x)',
      data: this.yRealValues,
      backgroundColor: "#000000",
      borderColor: "#000000",
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
     // showLine: false // no line shown
    }
    let datasets:any[] = [];
    datasets.push(this.functionDataSet);
    datasets = datasets.concat(aditionalDatasets);
    //console.log(xValues);
    //console.log(datasets);
    this.graphData = 
    {
      animationEnabled: false,  //change to false
      labels: this.xRealValues,
      datasets
    }
  }

  plotPerformanceGraph(generations: individual[][])
  {
    ///filling a vector with the generation numbers
    console.log("plotPerformanceGraph");
    let xValues = [];
    for (let i = 0; i <= this.maxNumOfGenerations; i++) {
      xValues.push(i);
    }
    console.log("xValues");
    console.log(xValues);
    ///filling data (y values - best individuals fitness and average for every generation)
    let datasets:any[] = [];
    let bestIndividualFitnessDataset =  
    {
      label: 'Best individual',
      data: generations.map((element) => {return this.bestIndividualFromAscendingPop(element).fitness}),
      backgroundColor: undefined,
      borderColor: "#000000",
      fill: false,
      pointRadius: 5,
      pointHoverRadius: 5,
      //showLine: false // no line shown
    }
    console.log("generations");
    console.log(generations.map((element) => {return this.bestIndividualFromAscendingPop(element).fitness}));

    let averageFitnessDataset =  
    {
      label: 'Average fitness',
      data: generations.map((element) => {return this.calcFitnessAverage(element)}),
      backgroundColor: "#eeeeff",
      borderColor: "#0000ff",
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: true,
     // showLine: false // no line shown
    }

    ///adding to the datasets graph
    datasets.push(bestIndividualFitnessDataset);
    datasets.push(averageFitnessDataset);

    ///updating the variable that were binded to the performance graph data
    this.performanceData = 
    {
      animationEnabled: false,  //change to false
      labels: xValues,
      datasets
    }

    this.bestIndividualData = 
    {
      animationEnabled: false,  //change to false
      labels: xValues,
      datasets: [bestIndividualFitnessDataset]
    }
  }

  getDataSetGeneration(generations: individual[][])
  {
    let gensDataset:any[] = [];
    //console.log(generation);
    for(let i = 0; i < generations.length; i++)
    {
      let data = [];
      
      data.fill(null, 0, this.populationSize);
      for(let indiv of generations[i])
      {
        //console.log("getDataSetGeneration")
        //console.log(indiv);
        let indivIndex = this.xRealValues.indexOf(indiv.realNumber);
        data[indivIndex] = this.functionDataSet.data[indivIndex];
      }

      let genDataset = {
        label: "Geração " + i,
        data,
        backgroundColor: undefined,
        borderColor: "#FF0000",
        fill: false,
        borderDash: [5, 5],
        pointRadius: 15,
        pointHoverRadius: 10
      };

      gensDataset.push(genDataset);
    }
    
    
    return gensDataset;
  }

  /////////////////////

  findMinimun()
  {
    console.log("findMinimun");
    
    ///restarting the variables

    this.initGensDataset();

    this.generations = [];
    this.bestInd = [];
    this.numCurrentGeneration = 0;

    let initialPopulation = this.selectInitialPopulation();
    let currentGeneration = initialPopulation;
    currentGeneration = this.getAscendingFitnessPopulation(initialPopulation);
    this.generations.push(currentGeneration);
    while(this.generations.length <= this.maxNumOfGenerations)
    {
      this.numCurrentGeneration++;
      //console.log(this.numCurrentGeneration);

      ///this is not need since we are ordering in the end of the "for"
      //currentGeneration = this.getAscendingFitnessPopulation(currentGeneration);
      
      //console.log(currentGeneration);
      let nextGeneration: individual[] = [];
      let individualsToKeep: individual[] = [];
      if(this.checkBoxSelectedItens.indexOf("elitism") >= 0)
      {
        if(this.numCurrentGeneration<2) console.log("enableElitism");
        individualsToKeep = this.bestIndividualsFromAscendingPop(currentGeneration, this.numOfElitismInd);
        if(this.numCurrentGeneration<2) console.log(individualsToKeep);
      }
     
      this.applyCrossover(currentGeneration, nextGeneration); 
      
      ///console here will show the final next population, since chrome update the objects in console
      this.applyMutation(nextGeneration);
      
      //console.log(nextGeneration);

      ///concating the best individuals that were kept
      nextGeneration = nextGeneration.concat(individualsToKeep);

      ///for keeping ordered lists
      nextGeneration = this.getAscendingFitnessPopulation(nextGeneration);
      
      this.generations.push(nextGeneration);
      currentGeneration = nextGeneration;
    }
    this.generationsDataSets = this.getDataSetGeneration(this.generations);
    for(let i = 0; i < this.generations.length; i++)
    { 
      setTimeout
      (()=>{
        this.drawFunction(this.generationsDataSets.slice(i,i+1));
      }
      ,i * 2)
    }
    this.plotPerformanceGraph(this.generations);
    //this.generationsDataSets.push(this.getDataSetGeneration(this.generations[0]));
    
    //console.log(this.generations);

  }

  getAscendingFitnessPopulation(population: individual[]) :individual[]
  {
    //console.log("original")
    //console.log(population)
    let ordered: individual[] = [];
    ordered.push(population[0])
    ///starting at 1, since we had already added 0th
    for(let i = 1; i < population.length; i++)
    {
      let insertedIndividual = false;
      for(let j = 0; j < ordered.length; j++)
      {
        //console.log("j" + ordered[j].fitness);
        ///if the fitness is less than some already inserted individual's fitness, insert it before
        if(population[i].fitness < ordered[j].fitness)
        {
          ordered.splice(j, 0, population[i]);
          insertedIndividual = true;
          break;
        }
      }
      /// if it was not inserted, push it at the end, since it is the biggest value
      if(insertedIndividual===false)
      {
        ordered.push(population[i]);
      }
    }
    /*console.log("getAscendingFitnessPopulation");
    console.log("first");
    console.log(ordered[0]);
    console.log("last");
    console.log(ordered[ordered.length - 1]);*/
    return ordered;
  }

  calcSumFits(population: individual[]): number
  {
    let sumFits = 0;
    for(let ind of population){
      sumFits += ind.fitness;
    }
    //console.log("sumFits: " + sumFits);
    return sumFits;
  }

  calcPIs(population: individual[], fitSum:number): number[]
  {
    /*let pis:number[] = [];
    for(let ind of population){
      pis.push(ind.fitness/fitSum);
    }*/
    let pis = population.map((ind) => {return ind.fitness/fitSum});
    //console.log("calcSumPIs: " + pis);
    return pis;
  }

  calcCumulativeProb(probs: number[]): number[]
  {
    let cis: number[] = [];
    let ci = 0;
    for(let i = 0; i < probs.length; i++){
      ci += probs[i];
      cis.push(ci);
    }
    //console.log("calcCumulativeProb cis.length: " + cis.length);
    //console.log("calcCumulativeProb last ci: " + cis[cis.length-1]);
    return cis;
  }

  selectByRoulette(generation: individual[]): individual[]
  {
    let couples: individual[] = [];
    let sumFits:number = this.calcSumFits(generation);
    let pi = this.calcPIs(generation, sumFits);
    let ci = this.calcCumulativeProb(pi);
    while(couples.length < this.numOfNewIndividual())///voltar
    {
      let randomNumber = Math.random();
      let selectedIndex = 0;
      while(randomNumber > ci[selectedIndex])
      {
        selectedIndex++;
      }
      //console.log("selectByRoulette " + "randomNumber[" + randomNumber + "]" + " selectedIndex[" + selectedIndex + "]"+ " ci[" + ci[selectedIndex] + "]");
      couples.push(generation[selectedIndex]);
    }

    return couples;  
  }

  selectByTourney(generation: individual[]): individual[]
  {
    let couples: individual[] = [];
    //let teste:number = -2;
    while(couples.length < this.numOfNewIndividual())///voltar
    {
      ///select ind by random
      let tourneyIndividuals = [];
      for (let index = 0; index < this.numOfIndividualsInTourney; index++) 
      {
        let randomIndex = Math.floor(Math.random() * this.populationSize);
        //if(teste < 0 && this.numCurrentGeneration < 2) console.log("selectByTourney randomIndex: " +randomIndex);
        tourneyIndividuals.push(generation[randomIndex]);
      }

      ///select the best in the group
      tourneyIndividuals = this.getAscendingFitnessPopulation(tourneyIndividuals);
      
      couples.push(this.bestIndividualFromAscendingPop(tourneyIndividuals));

      /*if(teste < 0 && this.numCurrentGeneration < 2)
      {
        teste++;
        console.log(tourneyIndividuals);
        console.log(this.bestIndividualFromAscendingPop(tourneyIndividuals));
      }*/
    }
    

    return couples;
  }

  bestIndividualFromAscendingPop(ascendingPopulation: individual[])
  {
    return ascendingPopulation[ascendingPopulation.length-1];
  }

  bestIndividualsFromAscendingPop(ascendingPopulation: individual[], numOfIndividuals)
  {
    return ascendingPopulation.slice(ascendingPopulation.length - numOfIndividuals, ascendingPopulation.length);
  }

  selectCouples(generation: individual[])
  {
    switch (this.couplesSelectionMode) {
      case "Roleta":
          //console.log("selectCouples roleta");
          return this.selectByRoulette(generation);
        break;
      case "Torneio":
          //console.log("selectCouples torneio");
          return this.selectByTourney(generation);
          break;
      default:
        //console.log("selectCouples default");
        return null;
        break;
    }
  }

  applyCrossover(previousGeneration: individual[], nextGeneration:individual[])
  {
    //console.log("applyCrossover");
    let couples = this.selectCouples(previousGeneration);
    for (let index = 0; index < couples.length; index+=2) 
    {
      let couple: individual[] = couples.slice(index,index + 2);
      //console.log("couple");
      //console.log(couple);
      if(Math.random() < this.probCruzamento)
      {
        ///cruza
        //console.log("can crossover");
        let newIndividuals: individual[] = this.crossIndividuals(couple);
        nextGeneration.push(newIndividuals[0]);
        nextGeneration.push(newIndividuals[1]);
        //console.log(nextGeneration);
      }
      else
      {
        ///keep with parents
        nextGeneration.push(couple[0]);
        nextGeneration.push(couple[1]);
        //console.log(nextGeneration);
      }
    }
  }

  crossIndividuals(couple: individual[]): individual[]
  {
    //console.log("crossIndividuals couple: ");
    //couple.forEach((indiv)=>console.log(indiv.chromosome));
    let newIndividuals: individual[]= [];
    let newChromosome: number[] = [];

    ///Math.floor(Math.random()*(this.resolution - 1)) 0 to 8 - +=1 1 to 9
    let indexToCross: number = Math.floor(Math.random()*(this.resolution - 1)) + 1;/// 1 to 9 (pos entre os bits)
    //console.log("crossIndividuals indexToCross: " + indexToCross);    
    
    newChromosome = couple[0].chromosome.slice(0, indexToCross).concat(couple[1].chromosome.slice(indexToCross, this.resolution));
    let ind1: individual = this.getIndividual(newChromosome);
    newIndividuals.push(ind1);
    //console.log("crossIndividuals ind1: " + ind1.chromosome);  

    newChromosome = couple[1].chromosome.slice(0, indexToCross).concat(couple[0].chromosome.slice(indexToCross, this.resolution));
    let ind2: individual = this.getIndividual(newChromosome);
    newIndividuals.push(ind2);
    //console.log("crossIndividuals ind2: " + ind2.chromosome); 

    return newIndividuals;
  }

  applyMutation(population: individual[])
  {
    let mutationApplied = false;
    //console.log("applyMutation");
    for(let j = 0; j < population.length; j++)
    {
      let indiv = population[j];
      mutationApplied = false;
      for(let k = 0; k < indiv.chromosome.length; k++)
      {
        if(Math.random() < this.probMutacao)
        {
          //console.log("mutation in individual " + j + " chromosome " + k);
          mutationApplied = true;
          //console.log("before mutation" + indiv.chromosome[k]);
          if(indiv.chromosome[k] === 1) 
            indiv.chromosome[k] = 0;
          else //if(indiv.chromosome[k] === 0)
            indiv.chromosome[k] = 1
          //console.log("after mutation" + indiv.chromosome[k]);
        }
      }
      if(mutationApplied)
      {
        population.splice(j, 1, this.getIndividual(indiv.chromosome));
      }
    }
  }

  selectIndividual(ci: number[]): number
  {
    //console.log(ci);
    let randomNumber = Math.random();
    let selectedIndex = 0;
    while(randomNumber > ci[selectedIndex])
    {
      selectedIndex++;
    }
    //console.log("selectIndividual " + "randomNumber[" + randomNumber + "]" + " selectedIndex[" + selectedIndex + "]"+ " ci[" + ci[selectedIndex] + "]");
    return selectedIndex;
  }

  getIntervalLabels(){
    let xValues:number[] = [];
    for(let i=0; i < this.getDecimalMax(); i++)
      xValues.push(this.wholeToReal(i));

    return xValues;
  }

  selectInitialPopulation(): individual[]
  {
    let currentGeneration:individual[] = [];
    for(let i = 0; i < this.populationSize; i++)
    {
      //console.log("selectInitialPopulation: " + i);
      currentGeneration.push(this.getIndividual(this.getRandomChromosome(this.resolution)));
    }

    /*
    let bits = [1,1,1,1,1,1,1,1,1,1]
    this.binArrayToDecimal(bits);
    this.wholeToReal( this.binArrayToDecimal(bits));

    for(let i = 0; i < this.populationSize; i++)
    {
      this.wholeToReal( this.binArrayToDecimal(currentGeneration[i]));
    }
    */
    return currentGeneration;
  }

  getIndividual(chromosome:number[]): individual
  {
    //console.log("getIndividual");
    let ind:individual = {chromosome};
    ind.realNumber = this.wholeToReal((this.binArrayToDecimal(ind.chromosome) + 1));
    ind.fitness = this.calcFitness(ind.realNumber);

    ///getting the best individuals
    this.evaluateIndividual(ind);

    return ind;
  }

  evaluateIndividual(indiv: individual)
  {
    let insertedInd;
    //let bestIndFull = this.bestInd.length == this.numOfBestToKeep;
    for(let i = 0; i < this.bestInd.length && i < this.numOfBestToKeep; i++)
    {
      insertedInd = false;
      if(this.hasIndividual(indiv))
      {
        //console.log("Already in the best");
        insertedInd = true;
        return;
      }
      else if(indiv.fitness > this.bestInd[i].fitness)
      {
        insertedInd = true;
        //indiv.generation = this.numCurrentGeneration;
        if(this.bestInd.length == this.numOfBestToKeep)// if it is full, removes one to insert
          this.bestInd.splice(i, 1, indiv);
        else
        {
          this.bestInd.splice(i, 0, indiv);
        }
        break;
      }
    }
    if(!insertedInd && this.bestInd.length < this.numOfBestToKeep)/// if it was not inserted and there is space
    {
      insertedInd = true;
      //indiv.generation = this.numCurrentGeneration;
      this.bestInd.push(indiv);
    }

    if(insertedInd)
    {
      indiv.generation = this.numCurrentGeneration;
      //console.log("bestInd");
      //console.log(this.bestInd);
    }
  }

  hasIndividual(indiv: individual)
  {
    let containsInd = false;
    this.bestInd.forEach(element => {
      if(element.realNumber == indiv.realNumber) containsInd=true;
    });
    return containsInd;
  }

  getRandomChromosome(resolution: number)
  {
    let chromosome = []; 
    for(let i = 0; i < resolution; i++)
      chromosome.push(Math.round(Math.random()));

    //console.log("getRandomChromosome: " + chromosome);

    return chromosome;
  }

  calcFitness(realNumber:number)
  {
    ///trab 02 funcion
    /// fitness was set as -f+c, since -f grows when f is minimized
    //return - this.functionToAnalise(realNumber) + 400;
    //return - this.functionToAnalise(realNumber);

    ///trab 03 funcion
    return this.functionToAnalise(realNumber) + (- this.minFunctionInTheInterval);
    
    ///considering 0 to 1
    //return (this.functionToAnalise(realNumber) + (- this.minFunctionInTheInterval)) / (this.maxFunctionInTheInterval - this.minFunctionInTheInterval);
  }

  functionToAnalise(x: number): number
  {
    ///trab 02 funcion
    //return - Math.abs(x * Math.sin(Math.sqrt(Math.abs(x)) ));

    ///trab 03 funcion
    ///to graph calculator - x * sin(x^4) + cos(x^2)
    return x * Math.sin(Math.pow(x, 4)) + Math.cos(Math.pow(x, 2));
  }

  binArrayToDecimal(bits: number[]){
    let decimalValue = 0;
    for(let i = 0; i < bits.length; i++)
      decimalValue += bits[i] * Math.pow(2, i); 
    
    //console.log("binArrayToDecimal: " + decimalValue);
    return decimalValue;
  }
  
  wholeToReal(decimalWhole: number){/// number=1:1024
    let realNumber = decimalWhole * (this.intervalMax-this.intervalMin)/this.getDecimalMax() + this.intervalMin;
    
    //console.log("wholeToReal: real " + realNumber + " whole " + decimalWhole);
    return realNumber;
  }

  getDecimalMax()
  {
    return Math.pow(2, this.resolution);
  }

  calcFitnessAverage(generation: individual[]): number
  {
    let averageFit:number = 0;
    generation.forEach((element) => {averageFit+=element.fitness});
    averageFit/=generation.length;
    return averageFit;
  }

  /////////////////////

}

interface  individual{
  chromosome: number[];
  realNumber?: number;
  fitness?:number;
  generation?:number;
}