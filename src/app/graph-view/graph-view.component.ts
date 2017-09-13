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
  @Output()
    emitMessage: EventEmitter<object> = new EventEmitter<object>();
  @Input()
    newId: number;
  @Input()
    inputAction: Action;
  nodesId: number[] = [];
  edgesId: string[] = [];
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
        return item === src;
      });
      let to = this.nodesId.find( item=>{
        return item === dst;
      });
      debugger
      if(typeof from =='undefined' && typeof to =='undefined'){
        let newErr = [{
          code: `Error: can't bind nodes reason: node:${src} and node ${dst} doesn't exit`,
          internal: true
        }]
        this.emitError.emit(newErr);
        return false
      }else if(typeof to == 'undefined'){
        let newErr = [{
          code: `Error: can't bind nodes reason: node:${dst} doesn't exit`,
          internal: true
        }]
        this.emitError.emit(newErr);
        return false
      }else if(typeof from == 'undefined'){
        let newErr = [{
          code: `Error: can't bind nodes reason: node:${src} doesn't exit`,
          internal: true
        }]
        this.emitError.emit(newErr);
        return false;
      }
    /* check existing of nodes*/
    let id = `${src}-${dst}`;
    if(this.edgesId.find( item =>{return  item === id})){
      let newErr = [{
        code: `Error: can't bind nodes reason: link from ${src} to ${dst} already exist!`,
        internal: true
      }]
      this.emitError.emit(newErr);
      return false
    }
    this.graph.add({
      group: 'edges',
      data: {
        id: id,
        source: src,
        target: dst
      }
    })
    this.edgesId.push(id)
    this.createMessage(`Was create link from ${src} to ${dst}`); //save adge
  }
  unbindNodes(src: number, dst: number){
    let id = `${src}-${dst}`;
    /* check existing of nodes*/
      let from = this.nodesId.find( item=>{
        return item === src;
      });
      let to = this.nodesId.find( item=>{
        return item === dst;
      });
      if(typeof from == 'undefined' && typeof to == 'undefined'){
        let newErr = [{
          code: `Error: can't unbind link from ${src} to ${dst}: node${src} and node${dst} doesn't exit`,
          internal: true
        }]
        this.emitError.emit(newErr);
        return false
      }else if(!to){
        let newErr = [{
          code: `Error: can't unbind link from ${src} to ${dst} reason: node:${dst} doesn't exit`,
          internal: true
        }]
        this.emitError.emit(newErr);
        return false
      }else if(typeof from =='undefined'){
        let newErr = [{
          code: `Error: can't unbind link from ${src} to ${dst} reason: node:${src} doesn't exit`,
          internal: true
        }]
        this.emitError.emit(newErr);
        return false;
      }
    /* check existing of nodes*/

    /*check existing edge*/
    if(!this.edgesId.find( item=>{ return item == id})){
      let newErr = [{
        code: `Error: can't unbind link from ${src} to ${dst} reason: this link dosen't exist`,
        internal: true
      }]
      this.emitError.emit(newErr);
      return false;
    }
    /*check existing edge*/
    let indexOfId = this.graph.indexOf(id)
    this.graph.remove(("edge#"+id))
    debugger
    this.edgesId.splice(indexOfId,0)
    debugger
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
            this.createMessage(`Node with id:${changes.newId.currentValue} was created`)
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
      if(changes.inputAction.currentValue.type && changes.inputAction.currentValue.type == 'unBind'){
        this.unbindNodes(changes.inputAction.currentValue.src, changes.inputAction.currentValue.dst)
      }
    }
  }
  createMessage(message: string){
    this.emitMessage.emit([{
      code: message,
      internal: true
    }]);
  }
}
