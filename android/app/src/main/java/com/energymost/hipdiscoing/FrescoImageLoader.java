// package com.energymost.hipdiscoing;
//
// import android.app.Activity;
// import android.content.Context;
// import android.content.res.Resources;
// import android.graphics.Bitmap;
// import android.graphics.drawable.Animatable;
// import android.graphics.drawable.Drawable;
// import android.net.Uri;
// import android.widget.ImageView;
//
// import com.facebook.common.references.CloseableReference;
// import com.facebook.common.util.UriUtil;
// import com.facebook.datasource.DataSource;
// import com.facebook.drawee.backends.pipeline.Fresco;
// import com.facebook.drawee.controller.BaseControllerListener;
// import com.facebook.drawee.drawable.ProgressBarDrawable;
// import com.facebook.drawee.generic.GenericDraweeHierarchy;
// import com.facebook.drawee.generic.GenericDraweeHierarchyBuilder;
// import com.facebook.drawee.interfaces.DraweeController;
// import com.facebook.drawee.view.DraweeHolder;
// import com.facebook.imagepipeline.common.ResizeOptions;
// import com.facebook.imagepipeline.core.ImagePipeline;
// import com.facebook.imagepipeline.core.ImagePipelineConfig;
// import com.facebook.imagepipeline.image.CloseableImage;
// import com.facebook.imagepipeline.image.CloseableStaticBitmap;
// import com.facebook.imagepipeline.image.ImageInfo;
// import com.facebook.imagepipeline.request.ImageRequest;
// import com.facebook.imagepipeline.request.ImageRequestBuilder;
//
// import cn.finalteam.galleryfinal.widget.GFImageView;
//
// import android.graphics.Canvas;
//
//
// /**
//  * Desction:fresco image loader
//  * Author:pengjianbo
//  * Date:15/12/24 下午9:34
//  */
// public class FrescoImageLoader implements cn.finalteam.galleryfinal.ImageLoader {
//
//     private Context context;
//
//     public FrescoImageLoader(Context context) {
//         this(context, Bitmap.Config.RGB_565);
//     }
//
//     public FrescoImageLoader(Context context, Bitmap.Config config) {
//         this.context = context;
//         ImagePipelineConfig imagePipelineConfig = ImagePipelineConfig.newBuilder(context)
//                 .setBitmapsConfig(config)
//                 .build();
//         Fresco.initialize(context, imagePipelineConfig);
//     }
//
//     @Override
//     public void displayImage(Activity activity, String path, final GFImageView imageView, final Drawable defaultDrawable, int width, int height) {
//         Resources resources = context.getResources();
//         GenericDraweeHierarchy hierarchy = new GenericDraweeHierarchyBuilder(resources)
//                 .setFadeDuration(300)
//                 .setPlaceholderImage(defaultDrawable)
//                 .setFailureImage(defaultDrawable)
//                 .setProgressBarImage(new ProgressBarDrawable())
//                 .build();
//         final DraweeHolder<GenericDraweeHierarchy> draweeHolder = DraweeHolder.create(hierarchy, context);
//         imageView.setOnImageViewListener(new GFImageView.OnImageViewListener() {
//             @Override
//             public void onDetach() {
//                 draweeHolder.onDetach();
//             }
//
//             @Override
//             public void onAttach() {
//                 draweeHolder.onAttach();
//             }
//
//             @Override
//             public boolean verifyDrawable(Drawable dr) {
//                 if (dr == draweeHolder.getHierarchy().getTopLevelDrawable()) {
//                     return true;
//                 }
//                 return false;
//             }
//             @Override
//             public void onDraw(Canvas canvas) {
//                 Drawable drawable = draweeHolder.getHierarchy().getTopLevelDrawable();
//                 if (drawable == null) {
//                     imageView.setImageDrawable(defaultDrawable);
//                 } else {
//                     imageView.setImageDrawable(drawable);
//                 }
//             }
//         });
//         Uri uri = new Uri.Builder()
//                 .scheme(UriUtil.LOCAL_FILE_SCHEME)
//                 .path(path)
//                 .build();
//         ImageRequest imageRequest = ImageRequestBuilder
//                 .newBuilderWithSource(uri)
//                 .setResizeOptions(new ResizeOptions(width, height))//图片目标大小
//                 .build();
//         DraweeController controller = Fresco.newDraweeControllerBuilder()
//                 .setOldController(draweeHolder.getController())
//                 .setImageRequest(imageRequest)
//                 .build();
//         draweeHolder.setController(controller);
//     }
//
//     /**
//      * 加载远程图片
//      *
//      * @param url
//      * @param imageSize
//      */
//     private void displayImage(Uri url, ResizeOptions imageSize, final ImageView imageView, final DraweeHolder<GenericDraweeHierarchy> draweeHolder) {
//         ImageRequest imageRequest = ImageRequestBuilder
//                 .newBuilderWithSource(url)
//                 .setResizeOptions(imageSize)//图片目标大小
//                 .build();
//         ImagePipeline imagePipeline = Fresco.getImagePipeline();
//
//         final DataSource<CloseableReference<CloseableImage>> dataSource = imagePipeline.fetchDecodedImage(imageRequest, this);
//         DraweeController controller = Fresco.newDraweeControllerBuilder()
//                 .setOldController(draweeHolder.getController())
//                 .setImageRequest(imageRequest)
//                 .setControllerListener(new BaseControllerListener<ImageInfo>() {
//                     @Override
//                     public void onFinalImageSet(String s, ImageInfo imageInfo, Animatable animatable) {
//                         CloseableReference<CloseableImage> imageReference = null;
//                         try {
//                             imageReference = dataSource.getResult();
//                             if (imageReference != null) {
//                                 CloseableImage image = imageReference.get();
//                                 if (image != null && image instanceof CloseableStaticBitmap) {
//                                     CloseableStaticBitmap closeableStaticBitmap = (CloseableStaticBitmap) image;
//                                     Bitmap bitmap = closeableStaticBitmap.getUnderlyingBitmap();
//                                     if (bitmap != null && imageView != null) {
//                                         imageView.setImageBitmap(bitmap);
//                                     }
//                                 }
//                             }
//                         } finally {
//                             dataSource.close();
//                             CloseableReference.closeSafely(imageReference);
//                         }
//                     }
//                 })
//                 .setTapToRetryEnabled(true)
//                 .build();
//         draweeHolder.setController(controller);
//     }
//
//     @Override
//     public void clearMemoryCache() {
//
//     }
// }
