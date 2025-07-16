import { useSetting } from "../../context/useSetting";

const Home: React.FC = () => {

  const {settings, perms} = useSetting();
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <h2>Permissions</h2>
      <pre>{JSON.stringify(perms.sort(), null, 2)}</pre>
      <h2>Setting</h2>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  );
}

export default Home;