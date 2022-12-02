export class AccordionService {

  items: any[] = []
  constructor() {

  }

  registerItemState(state: any) {
    this.items.push(state)
  }

  closeAll() {
    this.items.forEach(item => {
      item.isOpen = false
    })
  }

}