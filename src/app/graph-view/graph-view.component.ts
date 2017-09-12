import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import * as cytoscape from "cytoscape";

import { DataService } from '../data.service';
import { Action } from '../models/action';

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
  @Input()
    inputAction: Action;
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
  bindNodes(src: number, dst: number){
    /* check existing of nodes*/
      let from = this.nodesId.find( item=>{
        return item == src;
      });
      let to = this.nodesId.find( item=>{
        return item == dst;
      });
      if(!from && !to){
        let newErr = [{
          code: `Error: can't bind nodes reason: node:${src} and node ${dst} doesn't exit`,
          internal: true
        }]
        this.emitError.emit(newErr);
        return false
      }else if(!to){
        let newErr = [{
          code: `Error: can't bind nodes reason: node:${dst} doesn't exit`,
          internal: true
        }]
        this.emitError.emit(newErr);
        return false
      }else if(!from){
        let newErr = [{
          code: `Error: can't bind nodes reason: node:${src} doesn't exit`,
          internal: true
        }]
        this.emitError.emit(newErr);
        return false;
      }
    /* check existing of nodes*/
    let id = `${src}-${dst}`;
    this.graph.add({
      group: 'edges',
      data: {
        id: id,
        source: src,
        target: dst
      }
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
          if(typeof flag == 'number'){
            let newErr = [{
              code: `Error: node with id:${changes.newId.currentValue} already exist!`,
              internal: true
            }]
            this.emitError.emit(newErr)
          }else{
            this.nodesId.push(changes.newId.currentValue)
            this.graph.add({
              group: 'nodes',
              data: { id: changes.newId.currentValue },
              position: { x: startPosPoint, y: startPosPoint }
            })
          }
        /*check new node in saved nodes */


      }

    }
    if(changes.inputAction){
      if(!changes.inputAction.currentValue){
        return false
      }
      if(changes.inputAction.currentValue.type && changes.inputAction.currentValue.type == 'bind'){
        this.bindNodes(changes.inputAction.currentValue.src, changes.inputAction.currentValue.dst)
      }
    }
  }
}
