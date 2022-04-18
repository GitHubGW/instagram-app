import "moment/locale/ko";
import moment from "moment";
import styled from "styled-components/native";

interface UpdatedAtProps {
  updatedAt?: string | number;
}

const UpdatedAtText = styled.Text`
  color: ${(props) => props.theme.grayTextColor};
  font-size: 12px;
`;

const UpdatedAt = ({ updatedAt = "" }: UpdatedAtProps) => {
  const parsedUpdatedAt: string = moment(new Date(+updatedAt), "YYYYMMDD").fromNow();
  return <UpdatedAtText>{parsedUpdatedAt}</UpdatedAtText>;
};

export default UpdatedAt;
