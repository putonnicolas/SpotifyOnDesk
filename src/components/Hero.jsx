const Hero = () => {
  return (
    <section>
      <div className="flex flex-col border">
        <div className="flex flex-row mt-5 ml-5 border">
          <img src="./placeholder.jpeg" width={340}/>
          {/* penser aux artistes en feats */}
          <div className="mt-5 ml-5 flex flex-col flex-1 border">
            <p className="font-semibold">Into You</p>
            <p className="font-light">Ariana Grande</p> 
          </div>
        </div>
      <p>Durée</p>
      </div>
    </section>
  )
}

export default Hero