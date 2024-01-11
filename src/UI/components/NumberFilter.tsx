
interface Props {
    start: number;
    end: number;
    onChange: (maxValue: number, minValue: number) => void;
}

const NumberFilter = ({start, end, onChange}: Props) => {
  return (
    <div>NumberFilter</div>
  )
}

export default NumberFilter