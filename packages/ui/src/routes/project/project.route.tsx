import { useEffect } from 'react';
import { useParams } from 'react-router';

export default function ProjectRoute() {
  const params = useParams<{ id: string }>();
  console.log(params);

  return 'hee';
}
