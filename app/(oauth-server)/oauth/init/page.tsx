import { Post } from "./actions";

const Page = () => {

  return (
    <>
    <form action={Post}>
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button type="submit">submit</button>
    </form>
    </>
  )
};

export default Page;