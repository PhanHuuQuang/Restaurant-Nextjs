import { getCategories } from "@/api/categories";
import Link from "next/link";
import { colorClasses } from "./constant";

const MenuPage = async () => {
  const categories = await getCategories();
  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col md:flex-row items-center">
      {categories.map((category) => {
        const color = colorClasses[category.color] ?? colorClasses.black;
        return (
          <Link
            href={`/menu/${category.slug}`}
            key={category.id}
            className="w-full h-1/3 bg-cover p-6 md:h-[70%]"
            style={{ backgroundImage: `url(${category.img})` }}
          >
            <div className={`w-1/2 ${color.text}`}>
              <h1 className="uppercase font-bold text-2xl md:text-3xl">
                {category.title}
              </h1>
              <p className="text-sm my-1">{category.desc}</p>
              <button
                className={`hidden xl:block py-2 px-4 rounded-md ${color.button}`}
              >
                Explore
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MenuPage;
