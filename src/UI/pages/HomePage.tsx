import styled from "@emotion/styled"

const HomePage = () => {

    const Div = styled("div")({
        backgroundImage: "url('bg-image.png')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100%',

    })
  return (
    <Div>HomePage</Div>
  )
}

export default HomePage