type MessageType = {
    message: string
    apiPath: string
    data: any
}

self.onmessage = async (e: MessageEvent<MessageType>) => {
    
    const {apiPath, data:msgdata} = e.data
    const cards: Array<string> = msgdata.cards
    
    const atlas = await fetch(apiPath + '/atlas')
    const atlasBitmap = await createImageBitmap(await atlas.blob())
    
    const cardHeight = 450//atlasBitmap.height
    const cardWidth = 288//atlasBitmap.width / Object.keys(mapping).length

    if ((atlasBitmap.width / cardWidth % 1) != 0 || (atlasBitmap.height / cardHeight %1) != 0) {
      throw new Error('Invalid atlas dimensions')
    }
    function indexToCoordinates(index: number){
      const nmbWidth = atlasBitmap.width / cardWidth
      return {x:index%nmbWidth, y:Math.floor(index/nmbWidth)}
    }
    const canvas = new OffscreenCanvas(cardWidth, cardHeight)
    // const context = canvas.getContext('bitmaprenderer')
    const context = canvas.getContext('2d')
    await Promise.all(
      cards.sort().map(async (card, index) => {
        const coords = indexToCoordinates(index)
        const bitmap = await createImageBitmap(
          atlasBitmap,
          coords.x*cardWidth,
          coords.y*cardHeight,
          cardWidth,
          cardHeight
        )
        context?.drawImage(bitmap, 0, 0)
        // context?.transferFromImageBitmap(bitmap)
        bitmap.close()
        self.postMessage({ url: URL.createObjectURL(await canvas.convertToBlob()), card });
      })
    )
    atlasBitmap.close()
};