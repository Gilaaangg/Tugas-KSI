import { useLocation } from 'react-router-dom';
import Explore from './Explore.jsx';

export default function ContentList() {
  const location = useLocation();
  // Simply wrap or render Explore with type context
  return <Explore />;
}
