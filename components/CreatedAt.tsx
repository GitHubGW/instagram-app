import "moment/locale/ko";
import moment from "moment";
import styled from "styled-components/native";

interface CreatedAtProps {
  createdAt?: string | number;
}

const CreatedAtText = styled.Text`
  color: ${(props) => props.theme.grayTextColor};
  font-size: 12px;
`;

const CreatedAt = ({ createdAt = "" }: CreatedAtProps) => {
  const parsedCreatedAt: string = moment(new Date(+createdAt), "YYYYMMDD").fromNow();
  return <CreatedAtText>{parsedCreatedAt}</CreatedAtText>;
};

export default CreatedAt;
