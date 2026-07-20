import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";


interface GalleryData{
  catalog: HTMLElement[];
}

export class GalleryView extends Component<GalleryData>{
  private catalogEl: HTMLElement;

  constructor(container: HTMLElement){
    super(container); 
    this.catalogEl = ensureElement<HTMLElement>(".gallery", this.container);
  }

  set catalog(items: HTMLElement[]){
    this.catalogEl.replaceChildren(...items);
  }

}