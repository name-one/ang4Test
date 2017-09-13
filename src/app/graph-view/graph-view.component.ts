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
  edges: any[] = [];
  connectedNodes: string;
  layout;
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
    this.layout = this.graph.layout({
        name: 'random',
    })
    this.graph.on('click', 'node', (e)=>{
      var node = e.target;
      let edges = node.connectedEdges()

      if(!edges.length){
        this.createMessage(`this node:${node.id()} hasn't linked nodes`)
      }else{
        let chains = this.getAllPaths(+node.id());
        this.createMessage(`element reacheble from ${node.id()}:`)
        let path = chains.map( item =>{
          let path = item.join('->');
          return path;
        })
        /*pause on print*/
          path.forEach( item =>{
            let interval = setTimeout(()=>{
              this.createMessage(item)
              clearTimeout(interval)
            },0)

          })


      }
    })

  }

  getAllPaths(nodeId : number) {
      let chains : number[][] = [];
      this.internalGetAllPaths(nodeId, [nodeId], [nodeId], this.edges, chains);

      return chains;
  }

  internalGetAllPaths(nodeId : number, marked: number[], currentChain: number[],
    edges: any[], chains: number[][]) {
      var nodesToVisit = edges
        .filter(e => e.from === nodeId && marked.indexOf(e.to) == -1)
        .map(e => e.to);
      for(let node of nodesToVisit) {
        marked.push(node);
        let chain = currentChain.map(_ => _);
        chain.push(node);
        chains.push(chain);
        this.internalGetAllPaths(node, marked, chain, edges, chains);
      }
  }

  reachedElement(edges){
    if(!edges.length){
      this.connectedNodes+= ';';

      return false;
    }else{
      for( let i = 0 ; i<edges.length; i++){
        let id = edges[i]._private.data.target
        let node = this.graph.getElementById(`${i}`);
        let innerEdges = node.connectedEdges();
        this.connectedNodes+=`->${id}`;
        this.reachedElement(innerEdges)

      }
    }
  }
  bindNodes(src: number, dst: number){
    /* check existing of nodes*/
      let from = this.nodesId.find( item=>{
        return item === src;
      });
      let to = this.nodesId.find( item=>{
        return item === dst;
      });
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
    this.edges.push({
      from: src,
      to: dst
    })
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
    this.edgesId.splice(indexOfId,0)
    this.createMessage(`link from ${src} to ${dst} was unbind`);
  }
  ngOnChanges(changes){
    if(changes.newId){
      let startPosPoint = changes.newId.currentValue*30+40;
      let startPosPointX = Math.floor((Math.random()*171)+200);
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
              // position: { x: startPosPointX, y: startPosPoint }
            })

            this.createMessage(`Node with id:${changes.newId.currentValue} was created`);
            let count = this.nodesId.length;
            this.graph.nodes().positions(function( node, i ){
                return {
                  x: 400 + Math.sin(6.28 * i / count) * 200,
                  y: 400 + Math.cos(6.28 * i / count) * 200,
                };
              });
              this.graph.forceRender();
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
