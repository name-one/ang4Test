import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import * as cytoscape from "cytoscape";

import { DataService } from '../data.service';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss']
})
export class GraphViewComponent implements OnInit, OnChanges {
  graph: any;
  @Output()
    emitError: EventEmitter<object[]> = new EventEmitter<object[]>();
  @Input()
  newId: number;
  nodesId: number[] = [];
  constructor(private dataService: DataService) { }
  ngOnInit() {
    this.graph = cytoscape({
      container: document.getElementsByClassName('graph-view')[0],
      elements: [ // list of graph elements to start with
      ],
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#2196F3',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'curve-style': 'bezier',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      }

    });

    this.graph.on('click', 'node', (e)=>{
      var node = e.target;

    })

  }
  ngOnChanges(changes){
    if(changes.newId){
      let startPosPoint = changes.newId.currentValue*30+30;
      if(this.graph){
        /*check new node in saved nodes */
          let flag = this.nodesId.find( item=>{
            return item == changes.newId.currentValue;
          })
          if(flag){
            let newErr = [{
              code: `Error: node with id:${changes.newId.currentValue} already exist!`,
              internal: true
            }]
            this.emitError.emit(newErr)
          }
        /*check new node in saved nodes */
        this.nodesId.push(changes.newId.currentValue)
        this.graph.add({
          group: 'nodes',
          data: { id: changes.newId.currentValue },
          position: { x: startPosPoint, y: startPosPoint }
        })
      }

    }
  }
}
