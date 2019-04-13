using UnityEngine;
using EasyAR;
using UnityEngine.Video;
using static NativeGallery;

public class VideoImageTargetBehaviour : ImageTargetBehaviour
{
    private const float X_VIDEO_ROTATION = 90;
    private const float VIDEO_SCALING = 1.15f;

    protected override void Awake()
    {
        base.Awake();
        TargetFound += OnTargetFound;
        TargetLost += OnTargetLost;
        TargetLoad += OnTargetLoad;
        TargetUnload += OnTargetUnload;
    }

    void OnTargetFound(TargetAbstractBehaviour behaviour)
    {
        Debug.Log("Found: " + Target.Id + " (" + Target.Name + ")");
        var videoComponents = GetComponentsInChildren<VideoPlayer>(true);
        foreach (var component in videoComponents)
        {
            string videoURL = Application.persistentDataPath + "/" + Target.Name + ".mp4";
            if (System.IO.File.Exists(videoURL))
            {
                component.targetTexture = new RenderTexture(1, 1, 0);
                component.source = VideoSource.Url;
                component.url = videoURL;
                VideoProperties videoProperties = GetVideoProperties(component.url);
                component.prepareCompleted += (VideoPlayer source) =>
                {
                    float videoWidth = source.texture.width;
                    float videoHeight = source.texture.height;
                    Debug.Log("Rotation: " + videoProperties.rotation);
                    component.transform.localScale = new Vector3(videoWidth / Mathf.Max(videoWidth, videoHeight) * VIDEO_SCALING,
                        videoHeight / Mathf.Max(videoWidth, videoHeight) * VIDEO_SCALING, 1f);
                    component.transform.rotation = Quaternion.Euler(X_VIDEO_ROTATION, 0, -1 * videoProperties.rotation); // Lay the video flat
                };
                component.Prepare();
                Debug.Log("Playing from: " + Application.persistentDataPath + "/" + Target.Name + ".mp4");
            }
            else
            {
                Debug.Log("File does not exists");
            }
        }
    }

    void OnTargetLost(TargetAbstractBehaviour behaviour)
    {
        Debug.Log("Lost: " + Target.Id + " (" + Target.Name + ")");
    }

    void OnTargetLoad(ImageTargetBaseBehaviour behaviour, ImageTrackerBaseBehaviour tracker, bool status)
    {
        Debug.Log("Load target (" + status + "): " + Target.Id + " (" + Target.Name + ") " + " -> " + tracker);
    }

    void OnTargetUnload(ImageTargetBaseBehaviour behaviour, ImageTrackerBaseBehaviour tracker, bool status)
    {
        Debug.Log("Unload target (" + status + "): " + Target.Id + " (" + Target.Name + ") " + " -> " + tracker);
    }
}