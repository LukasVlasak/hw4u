import { useTranslation } from "react-i18next";
import LoadingComponents from "./LoadingComponents";
import SlideShow from "./SlideShow";
import Review from "./Review";
import { useFeedback } from "../../hooks/useFeedback";

const Reviews = () => {
  const { data, isLoading } = useFeedback();
  const { t } = useTranslation();

  return isLoading ? (
    <LoadingComponents />
  ) : (
    <div className="my-5">
      <h1 className="text-center mb-3">{t("feedback.feedback")}</h1>
      {data?.length !== undefined && data.length > 0 ? (
        <SlideShow slidesToShow={3} speed={500}>
          {data.map((d) => {
            return (
              <Review
                key={d.feedback_id}
                stars={3}
                userName={d.full_name}
                text={d.message}
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
