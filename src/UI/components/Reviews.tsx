import { useTranslation } from "react-i18next";
import { useReviews } from "../../hooks/useReviews";
import LoadingComponents from "./LoadingComponents";
import SlideShow from "./SlideShow";
import Review from "./Review";

const Reviews = () => {
  const { data, isLoading } = useReviews();
  const { t } = useTranslation();

  return isLoading ? (
    <LoadingComponents />
  ) : (
    <div className="my-5">
      <h1 className="text-center mb-3">Reviews</h1>
      {data?.length !== undefined && data.length > 0 ? (
        <SlideShow slidesToShow={3} speed={500}>
          {data.map((d) => {
            return (
              <Review
                key={d.id}
                stars={d.stars}
                userName={d.user_name}
                text={d.text}
              />
            );
          })}
        </SlideShow>
      ) : (
        <p>{t("homePage.reviews.noReviewsAvailable")}</p>
      )}
    </div>
  );
};

export default Reviews;
